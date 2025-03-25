import pandas as pd
import json
import os
import sys
from statsmodels.tsa.stattools import coint
from datetime import datetime, timedelta
from dolphindb import session

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT


def connect_to_dolphindb():
    s = session()
    s.connect("46.202.149.154", 8848, "admin", "123456")
    return s

def fetch_data(s, table_name, tickers, start_date):
    s.run(f't = loadTable("dfs://yfs", "{table_name}")')
    query = f'''
    select Datetime, Symbol, AdjClose 
    from t 
    where Datetime > {start_date} and Symbol in {tickers}
    '''
    result = s.run(query)
    df = pd.DataFrame(result)
    df["Datetime"] = pd.to_datetime(df["Datetime"])
    return df.dropna(subset=['AdjClose'])

def check_cointegration(asset1, asset2, df):
    try:
        coint_result = coint(df[asset1], df[asset2])
        return coint_result[1]
    except KeyError:
        print(f"Skipping cointegration test for {asset1} and {asset2} due to missing data.")
        return None

def perform_cointegration_analysis(s, tickers, start_date, period_name):
    df = fetch_data(s, "stockdata_1d", tickers, start_date)
    df_pivot = df.pivot(index='Datetime', columns='Symbol', values='AdjClose')
    df_pivot = df_pivot.fillna(method='ffill').dropna()

    cointegration_results = []
    cointegrated_count = 0
    non_cointegrated_count = 0

    for i in range(len(tickers)):
        for j in range(i + 1, len(tickers)):
            asset1, asset2 = tickers[i], tickers[j]
            if asset1 not in df_pivot.columns or asset2 not in df_pivot.columns:
                continue

            p_value = check_cointegration(asset1, asset2, df_pivot)
            if p_value is None:
                continue

            is_cointegrated = bool(p_value < 0.05)  # Convert to Python boolean
            cointegrated_count += int(is_cointegrated)
            non_cointegrated_count += int(not is_cointegrated)

            result = {
                "asset1": asset1,
                "asset2": asset2,
                "p_value": float(p_value),
                "cointegrated": is_cointegrated
            }
            cointegration_results.append(result)
            print(f"Cointegration test between {asset1} and {asset2} - p-value: {p_value}")

    total_pairs = len(cointegration_results)
    cointegrated_percentage = (cointegrated_count / total_pairs) * 100 if total_pairs > 0 else 0
    non_cointegrated_percentage = (non_cointegrated_count / total_pairs) * 100 if total_pairs > 0 else 0

    return {
        "results": cointegration_results,
        "summary": {
            "total_pairs": int(total_pairs),
            "cointegrated_pairs": int(cointegrated_count),
            "cointegrated_percentage": float(cointegrated_percentage),
            "non_cointegrated_pairs": int(non_cointegrated_count),
            "non_cointegrated_percentage": float(non_cointegrated_percentage)
        }
    }

def get_cointegration_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "combined_cointegration_results.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            cointegration_data = json.load(json_file)
        return cointegration_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {"error": "Data not found"}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {"error": "Invalid data"}

def update_cointegration_data():
    s = connect_to_dolphindb()
    tickers = TICKERS_DICT.get('IBOV', [])
    now = datetime.now()
    start_date_6m = (now - timedelta(days=180)).strftime("%Y.%m.%d")
    start_date_12m = (now - timedelta(days=365)).strftime("%Y.%m.%d")

    results_6m = perform_cointegration_analysis(s, tickers, start_date_6m, "last_6_months")
    results_12m = perform_cointegration_analysis(s, tickers, start_date_12m, "last_12_months")

    combined_results = {
        "last_6_months": results_6m,
        "last_12_months": results_12m
    }

    script_dir = os.path.dirname(os.path.abspath(__file__))
    export_directory = os.path.join(script_dir, "export")
    os.makedirs(export_directory, exist_ok=True)
    output_file_path = os.path.join(export_directory, "combined_cointegration_results.json")

    with open(output_file_path, "w") as json_file:
        json.dump(combined_results, json_file, indent=4)

    print(f"Combined JSON file saved to: {output_file_path}")
    print(f"Cointegration data updated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    update_cointegration_data()