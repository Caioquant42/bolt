# app/utils/rrg_data.py

import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import dolphindb as ddb
from datetime import datetime, timedelta
import json

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

# Create a session and connect to the DolphinDB server
s = ddb.session()
s.connect("46.202.149.154", 8848, "admin", "123456")

def fetch_stockdata_1d(tickers, start_date=None, end_date=None):
    # If no dates are provided, use the last 60 days
    if not start_date:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=60)
    
    # Convert dates to string format if they're datetime objects
    if isinstance(start_date, datetime):
        start_date = start_date.strftime('%Y.%m.%dT%H:%M:%S')
    if isinstance(end_date, datetime):
        end_date = end_date.strftime('%Y.%m.%dT%H:%M:%S')

    # Convert tickers list to a string format for the query
    tickers_str = '(' + ', '.join([f'"{ticker}"' for ticker in tickers]) + ')'

    # DolphinDB script to fetch data from stockdata_1d
    script = f"""
    t = loadTable("dfs://yfs", "stockdata_1d")
    select Datetime, Symbol, AdjClose 
    from t 
    where Datetime between {start_date} : {end_date} and Symbol in {tickers_str}
    """

    try:
        # Execute the script and fetch the data
        data = s.run(script)
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(data)
        
        print(f"Fetched {len(df)} rows from the stockdata_1d table.")
        return df
    except Exception as e:
        print(f"Error fetching data from DolphinDB: {e}")
        return None

def calculate_rs_ratio(security, benchmark):
    rs = security / benchmark
    rs_ratio = rs / rs.rolling(window=14).mean()*100  # Smoothed RS
    return rs_ratio

def calculate_rs_momentum(rs_ratio):
    # Adjust momentum to float around 1
    rs_momentum = (rs_ratio.pct_change(periods=1) + 1)*100  # Shift to center around 1
    return rs_momentum

def get_rrg_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "rrg_data.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            rrg_data = json.load(json_file)
        print(f"RRG data loaded: {rrg_data}")
        
        # Rename keys to match schema
        for ticker in rrg_data:
            rrg_data[ticker]['RS_Ratio'] = rrg_data[ticker].pop('RS-Ratio')
            rrg_data[ticker]['RS_Momentum'] = rrg_data[ticker].pop('RS-Momentum')
        
        return rrg_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}

if __name__ == "__main__":
    # Fetch data from the stockdata_1d table
    tickers = TICKERS_DICT["TOP10"]
    df = fetch_stockdata_1d(tickers)

    # Pivot the DataFrame to have dates as index and tickers as columns
    data = df.pivot(index='Datetime', columns='Symbol', values='AdjClose')

    # Calculate RS-Ratio and RS-Momentum
    rs_ratios = {}
    rs_momentums = {}
    benchmark = 'BOVA11'  # Assuming BOVA11 is part of the data and used as a benchmark
    json_data = {}

    for ticker in tickers:
        if ticker != benchmark:
            rs_ratios[ticker] = calculate_rs_ratio(data[ticker], data[benchmark])
            rs_momentums[ticker] = calculate_rs_momentum(rs_ratios[ticker])
            
            # Get the last 5 valid RS-Ratio and RS-Momentum values along with their dates
            last_rs_ratio = rs_ratios[ticker].dropna().tail(5)
            last_rs_momentum = rs_momentums[ticker].dropna().tail(5)
            last_dates = last_rs_ratio.index.strftime('%Y-%m-%d').tolist()

            # Store the last 5 RS-Ratio, RS-Momentum values, and their dates in JSON format
            json_data[ticker] = {
                "Dates": last_dates,
                "RS-Ratio": last_rs_ratio.tolist(),
                "RS-Momentum": last_rs_momentum.tolist()
            }
            
            # Print the last 5 RS-Ratio, RS-Momentum values, and their dates
            print(f"\n{ticker} - Last 5 Entries:")
            for date, rs_ratio, rs_momentum in zip(last_dates, last_rs_ratio, last_rs_momentum):
                print(f"Date: {date}, RS-Ratio: {rs_ratio:.4f}, RS-Momentum: {rs_momentum:.4f}")
                
    # Get the directory of the current script
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Define the export directory
    export_directory = os.path.join(current_directory, "export")

    # Ensure the export directory exists
    os.makedirs(export_directory, exist_ok=True)

    # Save the data to a JSON file in the export directory
    json_filename = os.path.join(export_directory, 'rrg_data.json')
    with open(json_filename, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)
    
    print("\nRS-Ratio and RS-Momentum data saved to rrg_data.json")
    print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")