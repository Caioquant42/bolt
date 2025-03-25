import os
import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def str_to_float_regex(s):
    s = s.replace(" mi", "")
    match = re.search(r'-?[\d\.\,]+', s)
    if match:
        num_str = match.group(0)
        cleaned = num_str.replace('.', '').replace(',', '.')
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    return 0.0

def get_fluxo_ddm_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "fluxo.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            fluxo_ddm_data = json.load(json_file)
        return {"fluxo_ddm": fluxo_ddm_data}  # Wrap the data in a dictionary
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {"error": "Data not found"}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {"error": "Invalid data"}

def scrape_fluxo_data():
    url = "https://www.dadosdemercado.com.br/fluxo"
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        table = soup.find('table', {'class': 'normal-table', 'id': 'flow'})
        headers = [th.get_text(strip=True) for th in table.find('thead').find_all('th')]
        data = []
        
        for tr in table.find('tbody').find_all('tr'):
            cells = [td.get_text(strip=True) for td in tr.find_all('td')]
            row_data = {header: cell for header, cell in zip(headers, cells)}
            
            total = sum(str_to_float_regex(value) for key, value in row_data.items() if key != 'Data')
            row_data['Todos'] = f"{total:.2f}".replace('.', ',') + " mi"
            
            data.append(row_data)
        
        return data
    else:
        print("Failed to retrieve the webpage. Status code:", response.status_code)
        return None

def save_fluxo_data(data):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    export_directory = os.path.join(current_dir, "export")
    os.makedirs(export_directory, exist_ok=True)
    full_path = os.path.join(export_directory, 'fluxo.json')
    
    try:
        with open(full_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=4)
        print(f"Table data successfully saved to '{full_path}'")
    except Exception as e:
        print(f"An error occurred while saving the file: {str(e)}")

def update_fluxo_data():
    data = scrape_fluxo_data()
    if data:
        save_fluxo_data(data)
        print(f"Fluxo data updated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    update_fluxo_data()