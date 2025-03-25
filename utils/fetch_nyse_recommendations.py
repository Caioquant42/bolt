import sys
import os
import json
import time
import pandas as pd
import yfinance as yf
from datetime import datetime

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import USA_TICKERS_DICT
else:
    from .dictionary import USA_TICKERS_DICT


NYSE_tickers = USA_TICKERS_DICT.get('NYSE', [])

def get_nyse_recommendations_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "all_USA_NYSE.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            recommendations_data = json.load(json_file)
        return recommendations_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}


class YData:
    def __init__(self, ticker_symbol, interval='1d', period='max', world=True, start_date=None, end_date=None):
        self.ticker_symbol = ticker_symbol
        self.interval = interval
        self.period = period
        self.world = world
        self.start_date = start_date
        self.end_date = end_date
        self.ticker = self._add_sa_to_tickers(self.ticker_symbol)
        self.stock_data = yf.Ticker(self.ticker)

    def _add_sa_to_tickers(self, tickers):
        return f"{tickers}.SA" if not self.world else tickers

    def get_fundamental_data_summary(self):
        try:
            info = self.stock_data.info
            
            # Define the specific fields we want to fetch
            desired_fields = [
                "currentPrice", "targetHighPrice", "targetLowPrice", "targetMeanPrice",
                "targetMedianPrice", "recommendationMean", "recommendationKey",
                "numberOfAnalystOpinions", "averageAnalystRating"
            ]            
            # Create a dictionary with only the desired fields
            filtered_info = {field: info.get(field) for field in desired_fields if field in info}
            
            # Calculate additional metrics
            current_price = filtered_info.get('currentPrice')
            if current_price is not None and current_price != 0:
                filtered_info['% Distance to Mean'] = ((filtered_info.get('targetMeanPrice', 0) - current_price) / current_price) * 100
                filtered_info['% Distance to Median'] = ((filtered_info.get('targetMedianPrice', 0) - current_price) / current_price) * 100
                filtered_info['% Distance to Low'] = ((filtered_info.get('targetLowPrice', 0) - current_price) / current_price) * 100
                filtered_info['% Distance to High'] = ((filtered_info.get('targetHighPrice', 0) - current_price) / current_price) * 100
            else:
                filtered_info['% Distance to Mean'] = None
                filtered_info['% Distance to Median'] = None
                filtered_info['% Distance to Low'] = None
                filtered_info['% Distance to High'] = None
            
            return filtered_info

        except Exception as e:
            print(f"Error retrieving Recomendations data summary for {self.ticker}: {e}")
            return None

def save_all_fundamental_data_to_json(filename):
    all_data = {}
    for ticker in NYSE_tickers:
        ydata = YData(ticker)
        ticker_data = ydata.get_fundamental_data_summary()
        if ticker_data:
            all_data[ticker] = ticker_data

        print(f"{ticker} loaded successfully")
        time.sleep(5)
    
    try:
        # Get the full path for the file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(current_dir, 'export', filename)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=4)
        
        print(f"All Recomendations data summaries saved to {full_path}")
    
    except Exception as e:
        print(f"Error saving all Recomendations data summaries to {full_path}: {e}")

def main():
    filename = "all_USA_NYSE.json"
    save_all_fundamental_data_to_json(filename)
    print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()