import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
from datetime import datetime
import unidecode
import os

def fetch_and_save_dividend_data():
    # URL of the webpage to scrape
    url = 'https://www.dadosdemercado.com.br/agenda-de-dividendos'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Locate the table
    tabela = soup.find('table', class_='normal-table')

    # Extract headers
    cabecalhos = [unidecode.unidecode(th.text.strip()) for th in tabela.find('thead').find_all('th')]

    # Extract row data
    dados = []
    for linha in tabela.find('tbody').find_all('tr'):
        linha_dados = [unidecode.unidecode(td.text.strip()) for td in linha.find_all('td')]
        dados.append(linha_dados)

    # Create a DataFrame
    df = pd.DataFrame(dados, columns=cabecalhos)

    # Convert DataFrame to dictionary
    data_dict = df.to_dict(orient='records')

    # Get the absolute path of the current script directory
    current_directory = os.path.dirname(os.path.abspath(__file__))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'dividend_agenda_{timestamp}.json'
    file_path = os.path.join(current_directory, 'export', filename) # Create the full path

    # Save the data as a JSON file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, ensure_ascii=False, indent=4)

    print(f"Data successfully saved to {file_path}")
    return file_path
    
def get_dividend_agenda_analysis():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    export_dir = os.path.join(current_dir, "export")
    
    # Get the most recent file
    files = [f for f in os.listdir(export_dir) if f.startswith('dividend_agenda_') and f.endswith('.json')]
    if not files:
        print("No dividend agenda files found.")
        return {}
    
    latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(export_dir, x)))
    json_file_path = os.path.join(export_dir, latest_file)
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            dividend_data = json.load(json_file)
        return dividend_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}

if __name__ == "__main__":
    fetch_and_save_dividend_data()
