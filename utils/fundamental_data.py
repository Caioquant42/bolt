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
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

tickers = TICKERS_DICT.get('TODOS', [])

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
                "industry", "sector", "auditRisk", "boardRisk", "compensationRisk",
                "shareHolderRightsRisk", "overallRisk", "governanceEpochDate",
                "executiveTeam", "maxAge", "priceHint", "previousClose", "open",
                "dayLow", "dayHigh", "regularMarketPreviousClose", "regularMarketOpen",
                "regularMarketDayLow", "regularMarketDayHigh", "dividendRate",
                "dividendYield", "exDividendDate", "payoutRatio", "fiveYearAvgDividendYield",
                "beta", "trailingPE", "forwardPE", "volume", "regularMarketVolume",
                "averageVolume", "averageVolume10days", "averageDailyVolume10Day",
                "bid", "ask", "bidSize", "askSize", "marketCap", "fiftyTwoWeekLow",
                "fiftyTwoWeekHigh", "priceToSalesTrailing12Months", "fiftyDayAverage",
                "twoHundredDayAverage", "trailingAnnualDividendRate", "trailingAnnualDividendYield",
                "currency", "tradeable", "enterpriseValue", "profitMargins", "floatShares",
                "sharesOutstanding", "heldPercentInsiders", "heldPercentInstitutions",
                "impliedSharesOutstanding", "bookValue", "priceToBook", "lastFiscalYearEnd",
                "nextFiscalYearEnd", "mostRecentQuarter", "earningsQuarterlyGrowth",
                "netIncomeToCommon", "trailingEps", "forwardEps", "lastSplitFactor",
                "lastSplitDate", "enterpriseToRevenue", "enterpriseToEbitda", "52WeekChange",
                "SandP52WeekChange", "lastDividendValue", "lastDividendDate", "quoteType",
                "currentPrice", "targetHighPrice", "targetLowPrice", "targetMeanPrice",
                "targetMedianPrice", "recommendationMean", "recommendationKey",
                "numberOfAnalystOpinions", "totalCash", "totalCashPerShare", "ebitda",
                "totalDebt", "quickRatio", "currentRatio", "totalRevenue", "debtToEquity",
                "revenuePerShare", "returnOnAssets", "returnOnEquity", "grossProfits",
                "freeCashflow", "operatingCashflow", "earningsGrowth", "revenueGrowth",
                "grossMargins", "ebitdaMargins", "operatingMargins", "financialCurrency",
                "symbol", "language", "region", "typeDisp", "quoteSourceName", "triggerable",
                "customPriceAlertConfidence", "marketState", "shortName", "longName",
                "hasPrePostMarketData", "firstTradeDateMilliseconds", "regularMarketChange",
                "regularMarketDayRange", "fullExchangeName", "averageDailyVolume3Month",
                "fiftyTwoWeekLowChange", "fiftyTwoWeekLowChangePercent", "fiftyTwoWeekRange",
                "fiftyTwoWeekHighChange", "fiftyTwoWeekHighChangePercent", "fiftyTwoWeekChangePercent",
                "earningsTimestamp", "earningsTimestampStart", "earningsTimestampEnd",
                "earningsCallTimestampStart", "earningsCallTimestampEnd", "isEarningsDateEstimate",
                "epsTrailingTwelveMonths", "epsForward", "epsCurrentYear", "priceEpsCurrentYear",
                "fiftyDayAverageChange", "fiftyDayAverageChangePercent", "twoHundredDayAverageChange",
                "twoHundredDayAverageChangePercent", "sourceInterval", "exchangeDataDelayedBy",
                "averageAnalystRating", "cryptoTradeable", "regularMarketChangePercent",
                "regularMarketPrice", "corporateActions", "regularMarketTime", "exchange",
                "esgPopulated", "trailingPegRatio"
            ]
            
            # Create a dictionary with only the desired fields
            filtered_info = {field: info.get(field) for field in desired_fields if field in info}
            
            return filtered_info

        except Exception as e:
            print(f"Error retrieving fundamental data summary for {self.ticker}: {e}")
            return None

def save_all_fundamental_data_to_json():
    all_data = {}
    for ticker in tickers:
        ydata = YData(ticker)
        ticker_data = ydata.get_fundamental_data_summary()
        if ticker_data:
            all_data[ticker] = ticker_data

        print(f"{ticker} loaded successfully")
        time.sleep(1)
    
    try:
        # Get the absolute path of the script directory
        current_directory = os.path.dirname(os.path.abspath(__file__))
        filename = 'all_fundamental_data_summaries.json'
        file_path = os.path.join(current_directory, 'export', filename)  # Create full path
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=4)
        
        print(f"All fundamental data summaries saved to {file_path}")
    
    except Exception as e:
        print(f"Error saving all fundamental data summaries: {e}")

def get_fundamentalsummary_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "all_fundamental_data_summaries.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            fundamental_data = json.load(json_file)
        return fundamental_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}

def main():
    save_all_fundamental_data_to_json()
    print(f"Code last executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()