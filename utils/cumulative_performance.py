import requests
from bs4 import BeautifulSoup
import json
import yfinance as yf
from datetime import datetime, timedelta
import os

# Function to scrape CDI data
def scrape_cdi_data():
    url = "https://www.dadosdemercado.com.br/indices/cdi?form=MG0AV3"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table', id='index-values')
    
    cdi_data = {}
    for row in table.find_all('tr')[1:]:
        columns = row.find_all('td')
        year = columns[0].text.strip()
        monthly_data = {}
        months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        
        for i, month in enumerate(months):
            value = columns[i+1].get('data-value')
            if value and value != 'None':
                monthly_data[month] = float(value)
        
        cdi_data[year] = monthly_data
    
    return cdi_data

# Function to fetch data from yfinance
def fetch_yfinance_data(ticker, start_date, end_date):
    data = yf.Ticker(ticker).history(start=start_date, end=end_date, interval="1mo")
    return data['Close'].to_dict()

def transform_cdi_data(cdi_data):
    transformed_data = {}
    month_map = {
        'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04', 'Mai': '05', 'Jun': '06',
        'Jul': '07', 'Ago': '08', 'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12'
    }

    # Create a list of tuples (date, value) for sorting
    data_list = []
    for year, months in cdi_data.items():
        for month, value in months.items():
            month_num = month_map[month]
            date = f"{year}-{month_num}-01"
            last_day = (datetime.strptime(date, "%Y-%m-%d") + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            date_str = last_day.strftime("%Y-%m-%d")
            data_list.append((date_str, value))

    # Sort the list by date
    data_list.sort(key=lambda x: x[0])

    # Insert the sorted data into the dictionary
    for date_str, value in data_list:
        transformed_data[date_str] = value

    return transformed_data

def get_cumulative_performance():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_dir, "export", "cumulative_performace_data.json")
    
    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            performance_data = json.load(json_file)
        return performance_data
    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {json_file_path}")
        return {}
        
# Main execution
if __name__ == "__main__":
    # Scrape CDI data
    cdi_data = scrape_cdi_data()
    
    # Transform CDI data
    transformed_cdi_data = transform_cdi_data(cdi_data)  # This will now be sorted
    
    # Set date range for yfinance data (past 5 years)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=25*365)
    
    # Fetch yfinance data
    sp500_data = fetch_yfinance_data("^GSPC", start_date, end_date)
    gold_data = fetch_yfinance_data("GC=F", start_date, end_date)
    brlusd_data = fetch_yfinance_data("USDBRL=X", start_date, end_date)
    ibov_data = fetch_yfinance_data("^BVSP", start_date, end_date)
    
    # Combine all data
    combined_data = {
        "CDI": transformed_cdi_data,  # Use the sorted transformed data here
        "SP500": {k.strftime("%Y-%m-%d"): v for k, v in sp500_data.items()},
        "Gold": {k.strftime("%Y-%m-%d"): v for k, v in gold_data.items()},
        "USDBRL": {k.strftime("%Y-%m-%d"): v for k, v in brlusd_data.items()},
        "IBOV": {k.strftime("%Y-%m-%d"): v for k, v in ibov_data.items()}
    }
    
    # Convert the data to JSON
    json_data = json.dumps(combined_data, indent=2, ensure_ascii=False)

    # Get the directory of the current script
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Define the export directory
    export_directory = os.path.join(current_directory, "export")
    
    # Save the JSON data to a file in the export directory
    json_filename = os.path.join(export_directory, 'cumulative_performace_data.json')
    with open(json_filename, 'w', encoding='utf-8') as f:
        f.write(json_data)

    print("Data has been saved to cumulative_performace_data.json")