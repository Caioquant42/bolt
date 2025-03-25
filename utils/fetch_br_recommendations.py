import sys
import os
import json
import time
import pandas as pd
import yfinance as yf
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

tickers = TICKERS_DICT.get('TODOS', [])
def safe_get(dictionary, key, default=None):
    return dictionary.get(key, default)

def analyze_strongbuy(data):
    print("\n--- Starting analysis ---")
    
    # Step 1: Create DataFrame
    print("\nStep 1: Creating DataFrame")
    df = pd.DataFrame([
        {
            'ticker': ticker,
            'currentPrice': safe_get(stock_data, 'currentPrice'),
            'recommendationKey': safe_get(stock_data, 'recommendationKey'),
            'numberOfAnalystOpinions': safe_get(stock_data, 'numberOfAnalystOpinions'),
            '% Distance to Low': safe_get(stock_data, '% Distance to Low', 0),
            '% Distance to Median': safe_get(stock_data, '% Distance to Median', 0),
            '% Distance to High': safe_get(stock_data, '% Distance to High', 0)
        }
        for ticker, stock_data in data.items()
    ])
    print(f"DataFrame created. Shape: {df.shape}")
    print("Columns:", df.columns.tolist())
    print("\nSample data:")
    print(df.head())

    # Step 2: Filter for strong buy stocks
    print("\nStep 2: Filtering for strong buy stocks")
    strong_buy_assets = df[df['recommendationKey'] == 'strong_buy'].copy()
    print(f"Strong buy assets: {len(strong_buy_assets)}")
    if len(strong_buy_assets) == 0:
        print("No strong buy assets found. Returning empty list.")
        return []

    print("\nSample strong buy asset:")
    print(strong_buy_assets.iloc[0])

    # Step 3: Convert to numeric and handle NaNs
    print("\nStep 3: Converting to numeric and handling NaNs")
    numeric_columns = ['currentPrice', 'numberOfAnalystOpinions', '% Distance to Low', '% Distance to Median', '% Distance to High']
    for col in numeric_columns:
        strong_buy_assets[col] = pd.to_numeric(strong_buy_assets[col], errors='coerce')
    
    strong_buy_assets = strong_buy_assets.dropna(subset=['% Distance to Low', '% Distance to Median', 'numberOfAnalystOpinions'])
    print(f"Assets after handling NaNs: {len(strong_buy_assets)}")
    if len(strong_buy_assets) == 0:
        print("No assets left after handling NaNs. Returning empty list.")
        return []

    # Preserve original data to re-merge later
    original_data = strong_buy_assets.copy()

    # Normalize and calculate combined score
    print("\nNormalizing and calculating combined score")
    columns_to_normalize = ['numberOfAnalystOpinions', '% Distance to Low', '% Distance to Median']
    scaler = MinMaxScaler()
    strong_buy_assets[columns_to_normalize] = scaler.fit_transform(strong_buy_assets[columns_to_normalize])

    strong_buy_assets['combined_score'] = strong_buy_assets[columns_to_normalize].sum(axis=1)
    
    # Add combined score to original data
    original_data['combined_score'] = strong_buy_assets['combined_score']
    
    # Sort based on combined score
    sorted_tickers = original_data.sort_values(by='combined_score', ascending=False)
    sorted_tickers['relevance'] = range(1, len(sorted_tickers) + 1)
    
    # Print final sorted tickers
    print("\nSorted tickers with original values and combined score:")
    print(sorted_tickers.head())

    # Prepare and return the results
    final_tickers = sorted_tickers[sorted_tickers['numberOfAnalystOpinions'] > 1]
    print(f"\nAssets with more than one original analyst opinion: {len(final_tickers)}")

    result = final_tickers.to_dict(orient='records')

    print(f"\nAnalysis complete. Total results: {len(result)}")
    return result

def analyze_buy(data):
    print("\n--- Starting analysis ---")
    
    # Step 1: Create DataFrame
    print("\nStep 1: Creating DataFrame")
    df = pd.DataFrame([
        {
            'ticker': ticker,
            'currentPrice': safe_get(stock_data, 'currentPrice'),
            'recommendationKey': safe_get(stock_data, 'recommendationKey'),
            'numberOfAnalystOpinions': safe_get(stock_data, 'numberOfAnalystOpinions'),
            '% Distance to Low': safe_get(stock_data, '% Distance to Low', 0),
            '% Distance to Median': safe_get(stock_data, '% Distance to Median', 0),
            '% Distance to High': safe_get(stock_data, '% Distance to High', 0)
        }
        for ticker, stock_data in data.items()
    ])
    print(f"DataFrame created. Shape: {df.shape}")
    print("Columns:", df.columns.tolist())
    print("\nSample data:")
    print(df.head())

    # Step 2: Filter for buy stocks
    print("\nStep 2: Filtering for buy stocks")
    buy_assets = df[df['recommendationKey'] == 'buy'].copy()
    print(f"Buy assets: {len(buy_assets)}")
    if len(buy_assets) == 0:
        print("No buy assets found. Returning empty list.")
        return []

    print("\nSample buy asset:")
    print(buy_assets.iloc[0])

    # Step 3: Convert to numeric and handle NaNs
    print("\nStep 3: Converting to numeric and handling NaNs")
    numeric_columns = ['currentPrice', 'numberOfAnalystOpinions', '% Distance to Low', '% Distance to Median', '% Distance to High']
    for col in numeric_columns:
        buy_assets[col] = pd.to_numeric(buy_assets[col], errors='coerce')
    
    buy_assets = buy_assets.dropna(subset=['% Distance to Low', '% Distance to Median', 'numberOfAnalystOpinions'])
    print(f"Assets after handling NaNs: {len(buy_assets)}")
    if len(buy_assets) == 0:
        print("No assets left after handling NaNs. Returning empty list.")
        return []

    # Preserve original data to re-merge later
    original_data = buy_assets.copy()

    # Normalize and calculate combined score
    print("\nNormalizing and calculating combined score")
    columns_to_normalize = ['numberOfAnalystOpinions', '% Distance to Low', '% Distance to Median']
    scaler = MinMaxScaler()
    buy_assets[columns_to_normalize] = scaler.fit_transform(buy_assets[columns_to_normalize])

    buy_assets['combined_score'] = buy_assets[columns_to_normalize].sum(axis=1)
    
    # Add combined score to original data
    original_data['combined_score'] = buy_assets['combined_score']
    
    # Sort based on combined score
    sorted_tickers = original_data.sort_values(by='combined_score', ascending=False)
    sorted_tickers['relevance'] = range(1, len(sorted_tickers) + 1)
    
    # Print final sorted tickers
    print("\nSorted tickers with original values and combined score:")
    print(sorted_tickers.head())

    # Prepare and return the results
    final_tickers = sorted_tickers[sorted_tickers['numberOfAnalystOpinions'] > 1]
    print(f"\nAssets with more than one original analyst opinion: {len(final_tickers)}")

    result = final_tickers.to_dict(orient='records')

    print(f"\nAnalysis complete. Total results: {len(result)}")
    return result

def get_recommendations_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "all_BR_recommendations.json")
    
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
    def __init__(self, ticker_symbol, interval='1d', period='max', world=False, start_date=None, end_date=None):
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
            print(f"Error retrieving fundamental data summary for {self.ticker}: {e}")
            return None

def save_all_fundamental_data_to_json(filename):
    all_data = {}
    for ticker in tickers:
        ydata = YData(ticker)
        ticker_data = ydata.get_fundamental_data_summary()
        if ticker_data:
            all_data[ticker] = ticker_data

        print(f"{ticker} loaded successfully")
        time.sleep(1)
    
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
    filename = "all_BR_recommendations.json"
    save_all_fundamental_data_to_json(filename)
    print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()