import pandas as pd
import re
import json

def convert_hours_to_json(hours_text):
    # Mapping for days to their respective indices
    day_mapping = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    }
    
    # Return None if no hours text is available
    if not isinstance(hours_text, str) or "Suggest new hours" not in hours_text:
        return None
    
    # Split the text into lines for each day
    lines = hours_text.split('Suggest new hours')[0].strip().split('\n')
    
    periods = []
    weekday_text = []
    
    for i, line in enumerate(lines):
        # Extract day, opening hour, and closing hour using regex
        match = re.match(r'(\w+day)\s*(\d+)\s* (AM|PM)–(\d+)\s* (AM|PM)', line)
        if match:
            day, open_hour, open_period, close_hour, close_period = match.groups()
            day_idx = day_mapping[day]
            
            # Convert times to the desired format
            open_time_formatted = f"{int(open_hour):02d}00" if 'AM' in open_period else f"{int(open_hour)+12:02d}00"
            close_time_formatted = f"{int(close_hour):02d}00" if 'AM' in close_period else f"{int(close_hour)+12:02d}00"
            
            # Append to periods and weekday_text lists
            periods.append({
                'open': {'day': day_idx, 'time': open_time_formatted},
                'close': {'day': day_idx, 'time': close_time_formatted}
            })
            weekday_text.append(f"{day}: {open_hour} {open_period} – {close_hour} {close_period}")
    
    # Construct the final JSON
    result = {
        'periods': periods,
        'weekday_text': weekday_text
    }
    
    return json.dumps(result)

# Load the dataset
data = pd.read_csv('path_to_your_input_file.csv')

# Apply the conversion function to the opening_hours column
data['opening_hours'] = data['opening_hours'].apply(convert_hours_to_json)

# Save the converted data back to a CSV file
data.to_csv('path_to_your_output_file.csv', index=False)
