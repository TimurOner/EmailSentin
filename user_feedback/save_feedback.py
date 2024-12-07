
import datetime
import csv




def append_value(url, value, *additional_params):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    record = [timestamp, value] + list(additional_params)
    
    with open(url, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(record)
    
    return record