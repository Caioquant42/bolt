import sys
import os
import json
import requests
import csv
import datetime
from datetime import datetime
import time


# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

# Define API key and headers
headers = {
    'Access-Token': 'NV0MENA0YZ9bgJA/Wf+F+tROe+eYX9SpUBuhmxNNkeIVuQKf+/wtVkYT4gGo0uvg--tTAJG2No3ZgblMOUkEql4g==--NzllMzczOTg2ZWI5ZmJlN2U2MjBmMDA3NGIxODcxOWQ='
}

# Define base URL for "Consultar uma ação" endpoint
base_url = 'https://api.oplab.com.br/v3/market/stocks/{symbol}'

filtered_stocks = []

def convert_timestamp(ms_timestamp):
    if ms_timestamp is None:
        return None
    timestamp = ms_timestamp / 1000  # convert milliseconds to seconds
    dt = datetime.fromtimestamp(timestamp)
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def fetch_stock_data(symbol, max_retries=3, delay=5):
    url = base_url.format(symbol=symbol)
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=30)  # Add a timeout
            response.raise_for_status()  # Raise an exception for bad status codes
            return response.json()
        except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
            print(f"Attempt {attempt + 1} failed for {symbol}: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"Failed to retrieve data for {symbol} after {max_retries} attempts. Skipping...")
                return None

def process_stock_data(stock):
    if not stock:
        return None

    filtered_stock = {
        'symbol': stock.get('symbol'),
        'type': stock.get('type'),
        'name': stock.get('name'),
        'open': stock.get('open'),
        'high': stock.get('high'),
        'low': stock.get('low'),
        'close': stock.get('close'),
        'volume': stock.get('volume'),
        'financial_volume': stock.get('financial_volume'),
        'trades': stock.get('trades'),
        'bid': stock.get('bid'),
        'ask': stock.get('ask'),
        'category': stock.get('category'),
        'contract_size': stock.get('contract_size'),
        'created_at': stock.get('created_at'),
        'updated_at': stock.get('updated_at'),
        'variation': stock.get('variation'),
        'ewma_1y_max': stock.get('ewma_1y_max'),
        'ewma_1y_min': stock.get('ewma_1y_min'),
        'ewma_1y_percentile': stock.get('ewma_1y_percentile'),
        'ewma_1y_rank': stock.get('ewma_1y_rank'),
        'ewma_6m_max': stock.get('ewma_6m_max'),
        'ewma_6m_min': stock.get('ewma_6m_min'),
        'ewma_6m_percentile': stock.get('ewma_6m_percentile'),
        'ewma_6m_rank': stock.get('ewma_6m_rank'),
        'ewma_current': stock.get('ewma_current'),
        'has_options': stock.get('has_options'),
        'iv_1y_max': stock.get('iv_1y_max'),
        'iv_1y_min': stock.get('iv_1y_min'),
        'iv_1y_percentile': stock.get('iv_1y_percentile'),
        'iv_1y_rank': stock.get('iv_1y_rank'),
        'iv_6m_max': stock.get('iv_6m_max'),
        'iv_6m_min': stock.get('iv_6m_min'),
        'iv_6m_percentile': stock.get('iv_6m_percentile'),
        'iv_6m_rank': stock.get('iv_6m_rank'),
        'iv_current': stock.get('iv_current'),
        'middle_term_trend': stock.get('middle_term_trend'),
        'semi_return_1y': stock.get('semi_return_1y'),
        'short_term_trend': stock.get('short_term_trend'),
        'stdv_1y': stock.get('stdv_1y'),
        'stdv_5d': stock.get('stdv_5d'),
        'beta_ibov': stock.get('beta_ibov'),
        'garch11_1y': stock.get('garch11_1y'),
        'isin': stock.get('isin'),
        'correl_ibov': stock.get('correl_ibov'),
        'entropy': stock.get('entropy'),
        'sector': stock.get('sector'),
        'cvmCode': stock.get('cvmCode'),
        'currency': stock.get('currency'),
        'currencyScale': stock.get('currencyScale'),
        'marketMaker': stock.get('marketMaker'),
        'previousClose': stock.get('previousClose'),
        'time': convert_timestamp(stock.get('time'))
    }
    return filtered_stock

def get_ibov_stocks():
    filtered_stocks = []
    for symbol in TICKERS_DICT["IBOV"]:
        print(f"Fetching {symbol} stock data")
        stock_data = fetch_stock_data(symbol)
        if stock_data:
            filtered_stock = process_stock_data(stock_data)
            if filtered_stock:
                filtered_stocks.append(filtered_stock)
        time.sleep(1)  # Small delay to avoid potential rate limiting
    return filtered_stocks

def getstatic_ibov_stocks():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_directory, "export", "IBOV_stocks.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            stocks = json.load(json_file)
        return stocks
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return []

def save_stocks_to_json(stocks, filename):
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(stocks, json_file, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    stocks = get_ibov_stocks()
    
    current_directory = os.path.dirname(os.path.abspath(__file__))
    export_directory = os.path.join(current_directory, "export")
    os.makedirs(export_directory, exist_ok=True)

    json_filename = os.path.join(export_directory, "IBOV_stocks.json")
    save_stocks_to_json(stocks, json_filename)
    print(f"Data has been written to {json_filename}")

    print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")