import pandas as pd
import json

def excel_to_json_dict(file_path):
    # Read the entire Excel file
    df = pd.read_excel(file_path)
    
    # Convert the DataFrame to a dictionary where 'symbol' column is the key,
    # and 'sector' is the value
    result_dict = df.set_index('symbol')['sector'].to_dict()
    
    return result_dict

def save_dict_to_json(dict_data, json_file_path):
    # Save the dictionary to a JSON file ensuring UTF-8 encoding
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(dict_data, json_file, indent=4, ensure_ascii=False)

# Example usage
file_path = 'sectors.xlsx'
json_dict = excel_to_json_dict(file_path)
json_file_path = 'sectors.json'
save_dict_to_json(json_dict, json_file_path)

print(f"Data saved to {json_file_path}")