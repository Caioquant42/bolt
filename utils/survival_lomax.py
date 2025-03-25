from dolphindb import session
import numpy as np
import pandas as pd
import argparse
import sys
import json
import traceback
import os
from datetime import datetime, timedelta
from scipy import stats
# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

survival_tickers = TICKERS_DICT.get('TOP100', [])
thresholds = [-0.03, -0.05, -0.07]

def query_dolphindb():
    # Connect to the DolphinDB server
    s = session()
    s.connect("46.202.149.154", 8848, "admin", "123456")

    # Load the table from the distributed file system
    s.run('t = loadTable("dfs://yfs", "stockdata_1d")')

    # Execute the query to filter the data by Time and select specific columns
    ddb_data = s.run('select Datetime, Symbol, AdjClose from t where Datetime > 2000.01.01T03:00:00')
    
    return ddb_data

def hist_interarrival(historical_data, threshold=-0.05):
    below_threshold = historical_data[historical_data['log_return'] < threshold]
    timestamps_sorted = below_threshold.index.sort_values()
    interarrival_time = timestamps_sorted.to_series().diff().dropna()
    return interarrival_time.dt.days

def fit_lomax(data):
    params = stats.lomax.fit(data, floc=0)
    return params[0], params[2]  # return shape (c) and scale

def lomax_survival_function(x, c, scale):
    return (1 + x/scale)**(-c)

def lomax_hazard_function(x, c, scale):
    return (c/scale) / (1 + x/scale)

def lomax_cumulative_hazard_function(x, c, scale):
    return -np.log(lomax_survival_function(x, c, scale))

def hill_estimator(data, k):
    data = np.sort(data)
    n = len(data)
    if k > n:
        raise ValueError("k must be less than or equal to the number of data points")
    log_excesses = np.log(data[-k:]) - np.log(data[-k])
    return 1 / np.mean(log_excesses)

def kaplan_meier_event_times(interarrival_days):
    interarrival_days = interarrival_days.sort_values()
    if interarrival_days.empty:
        return []
    event_counts = interarrival_days.value_counts().sort_index()
    return event_counts.index.tolist()

def lomax_analysis(interarrival_times, specific_day=None):
    c, scale = fit_lomax(interarrival_times)
    
    # Use Kaplan-Meier to get event times
    times = kaplan_meier_event_times(pd.Series(interarrival_times))
    
    survival_probs = lomax_survival_function(np.array(times), c, scale)
    hazard_rates = lomax_hazard_function(np.array(times), c, scale)
    cumulative_hazards = lomax_cumulative_hazard_function(np.array(times), c, scale)
    
    lomax_df = pd.DataFrame({
        'Time': times,
        'Survival Probability': survival_probs,
        'Hazard Rate': hazard_rates,
        'Cumulative Hazard': cumulative_hazards
    })
    
    if specific_day is not None:
        survival_prob = lomax_survival_function(specific_day, c, scale)
        hazard_rate = lomax_hazard_function(specific_day, c, scale)
        cumulative_hazard = lomax_cumulative_hazard_function(specific_day, c, scale)
        return survival_prob, hazard_rate, cumulative_hazard
    
    return lomax_df

def survival_data(data, ticker):
    df = data[data['Symbol'] == ticker].copy()
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    df = df.set_index('Datetime')
    df = df.sort_index()
    df['log_return'] = np.log(df['AdjClose'] / df['AdjClose'].shift(1))
    return df.dropna()

def last_incident(historical_data, threshold=-0.05):
    below_threshold = historical_data[historical_data['log_return'] < threshold]
    timestamps_sorted = below_threshold.index.sort_values()
    
    today = datetime.today().date()
    if timestamps_sorted.empty:
        return None
    last_available_date = timestamps_sorted.max().date()
    running_days = (today - last_available_date).days

    return running_days
    
def get_survival_lomax_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "survival_analysis_all_tickers_multi_threshold_lomax.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            survival_data = json.load(json_file)
        return survival_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}
if __name__ == "__main__":
    try:
        print(f"Using thresholds: {thresholds}", file=sys.stderr)

        current_dir = os.path.dirname(os.path.abspath(__file__))
        ddb_data = query_dolphindb()

        all_results = {}

        for ticker in survival_tickers:
            print(f"Processing ticker: {ticker}", file=sys.stderr)

            try:
                historical_data = survival_data(ddb_data, ticker)
                ticker_results = {}

                for threshold in thresholds:
                    interarrival_times = hist_interarrival(historical_data, threshold)
                    days_since_last_incident = last_incident(historical_data, threshold)

                    lomax_df = lomax_analysis(interarrival_times)

                    if not lomax_df.empty:
                        current_survival_prob, current_hazard_rate, current_cumulative_hazard = lomax_analysis(interarrival_times, days_since_last_incident)
                    else:
                        current_survival_prob, current_hazard_rate, current_cumulative_hazard = 1.0, 0.0, 0.0

                    days_to_check = [30, 60, 90]
                    specific_day_results = {}
                    for day in days_to_check:
                        survival_prob, hazard_rate, cumulative_hazard = lomax_analysis(interarrival_times, day)
                        specific_day_results[day] = {
                            "survival_probability": survival_prob,
                            "hazard_rate": hazard_rate,
                            "cumulative_hazard": cumulative_hazard
                        }

                    tail_index = hill_estimator(interarrival_times, min(20, len(interarrival_times) // 5))

                    threshold_results = {
                        "days_since_last_incident": days_since_last_incident,
                        "tail_index": tail_index,
                        "current_survival_probability": current_survival_prob,
                        "current_hazard_rate": current_hazard_rate,
                        "current_cumulative_hazard": current_cumulative_hazard,
                        "lomax": lomax_df.to_dict(orient="records"),
                        "specific_day_results": specific_day_results
                    }

                    ticker_results[str(threshold)] = threshold_results

                all_results[ticker] = ticker_results

            except Exception as e:
                print(f"Error processing ticker {ticker}: {str(e)}", file=sys.stderr)
                all_results[ticker] = {"error": str(e)}

        filename = f"survival_analysis_all_tickers_multi_threshold_lomax.json"
        file_path = os.path.join(current_dir, 'export', filename)

        with open(file_path, "w") as json_file:
            json.dump(all_results, json_file, indent=4)

        print(f"Results saved to: {file_path}", file=sys.stderr)
        #print(json.dumps(all_results))

        print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    except Exception as e:
        print(f"Error in survival.py: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1)