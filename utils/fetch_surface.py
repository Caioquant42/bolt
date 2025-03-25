import requests
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import sys
import time

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

def fetch_options(symbol):
    headers = {
        'Access-Token': 'NV0MENA0YZ9bgJA/Wf+F+tROe+eYX9SpUBuhmxNNkeIVuQKf+/wtVkYT4gGo0uvg--tTAJG2No3ZgblMOUkEql4g==--NzllMzczOTg2ZWI5ZmJlN2U2MjBmMDA3NGIxODcxOWQ='
    }

    url = f'https://api.oplab.com.br/v3/market/options/{symbol}'

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        options_data = response.json()
        
        print(f"Data received for {symbol}:")
        print(json.dumps(options_data[:1], indent=2))  # Print the first item in the response
        
        if not options_data:
            print(f"No data received for {symbol}")
            return None
        
        df = pd.DataFrame(options_data)
        print(f"Columns in the DataFrame: {df.columns}")
        
        return df.to_dict(orient='records')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None
    except KeyError as e:
        print(f"KeyError for {symbol}: {e}")
        print(f"Data structure: {options_data[0].keys() if options_data else 'No data'}")
        return None
    except Exception as e:
        print(f"Unexpected error for {symbol}: {e}")
        return None

def get_options_data(ticker=None):
    all_tickers_data = {}

    tickers = [ticker] if ticker else TICKERS_DICT["TOP10"]

    for ticker in tickers:
        ticker_data = fetch_options(ticker)
        if ticker_data:
            all_tickers_data[ticker] = ticker_data
        else:
            print(f"No data available for {ticker}")

    # Save the data to a JSON file in the export directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    export_dir = os.path.join(current_dir, "export")
    os.makedirs(export_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'options_data_{timestamp}.json'
    file_path = os.path.join(export_dir, filename)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(all_tickers_data, f, ensure_ascii=False, indent=4, default=str)

    print(f"Options data saved to {file_path}")

    if ticker:
        return all_tickers_data.get(ticker, {"error": f"No data found for {ticker}"})
    return all_tickers_data

def get_options_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    export_dir = os.path.join(current_dir, "export")
    
    # Get the most recent file
    files = [f for f in os.listdir(export_dir) if f.startswith('options_data_') and f.endswith('.json')]
    if not files:
        print("No options data files found.")
        return {}
    
    latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(export_dir, x)))
    json_file_path = os.path.join(export_dir, latest_file)
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            options_data = json.load(json_file)
        return options_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}

def get_surface_analysis(ticker=None):
    options_data = get_options_analysis()
    if ticker:
        return {ticker: options_data.get(ticker, {})}
    return options_data

# This part is for testing purposes when running the script directly
if __name__ == "__main__":
    all_data = get_options_data()
    print(json.dumps(all_data, indent=2, default=str))
    
    # Test the get_options_analysis function
    print("\nTesting get_options_analysis function:")
    analysis_data = get_options_analysis()
    print(json.dumps(analysis_data, indent=2, default=str))