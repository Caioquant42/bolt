import requests
import json
import traceback

url = "http://127.0.0.1:5000/api/optimize"
data = {
    "stocks": "PETR4,VALE3,ITUB4,SUZB3",
    "period": 12
}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, data=json.dumps(data), headers=headers)
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Response Content:", response.text)

    response.raise_for_status()  # Raises an HTTPError for bad responses

    try:
        print("JSON Response:", response.json())
    except json.JSONDecodeError:
        print("Could not decode JSON response")
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    print(traceback.format_exc())