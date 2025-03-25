import sys
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
from datetime import datetime
import unidecode
import time

# Add this block at the beginning of the file
if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, project_root)
    from utils.dictionary import TICKERS_DICT
else:
    from .dictionary import TICKERS_DICT

tickers = TICKERS_DICT.get('IBOV', [])

def fetch_dividend_data(ticker):
    url = f'https://www.dadosdemercado.com.br/acoes/{ticker}/dividendos'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all tables
    tables = soup.find_all('table', class_='normal-table')

    # Select the second table (index 1)
    if len(tables) >= 2:
        tabela = tables[1]
    else:
        print(f"Second table not found for {ticker}")
        return None

    # Extract headers
    cabecalhos = [unidecode.unidecode(th.text) for th in tabela.find('thead').find_all('th')]

    # Extract row data
    dados = []
    for linha in tabela.find('tbody').find_all('tr'):
        linha_dados = [unidecode.unidecode(td.text.strip()) for td in linha.find_all('td')]
        dados.append(linha_dados)

    # Create DataFrame
    df = pd.DataFrame(dados, columns=cabecalhos)

    # Convert DataFrame to dictionary
    data_dict = df.to_dict(orient='records')

    return data_dict

def fetch_and_save_all_dividend_data():
    all_data = {}
    for ticker in tickers:
        print(f"Fetching data for {ticker}...")
        ticker_data = fetch_dividend_data(ticker)
        if ticker_data:
            all_data[ticker] = ticker_data
        time.sleep(1)  # Add a delay to avoid overwhelming the server

    # Get the absolute directory of the script and ensure the file is saved there
    current_directory = os.path.dirname(os.path.abspath(__file__))  # Get the script's directory
    filename = 'all_historical_dy.json'
    file_path = os.path.join(current_directory, 'export', filename)  # Create full path

    # Save all data as JSON
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=4)

    print(f"All data saved to {file_path}")
    return file_path

def get_historicaldy_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "all_historical_dy.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            historical_dy_data = json.load(json_file)
        return historical_dy_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}
if __name__ == "__main__":
    fetch_and_save_all_dividend_data()
