# Opening Hours Conversion Script Setup

This guide will help you set up the environment to run the `opening_hours_conversion.py` script which converts the opening hours format in a CSV dataset.

## Prerequisites

- Python 3.x
- pip (Python Package Installer)

## Setup Instructions

1. **Clone the Repository (Optional)**
   If the script is part of a repository, clone it to your local machine:
   ```bash
   git clone <repository_url>
   cd <repository_directory>

2. Setup Virtual Environment (Recommended)
It's a good practice to create a virtual environment for your Python projects. This ensures that the dependencies of different projects don't interfere with each other.

python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

3. Install Required Packages
Install the required Python packages using pip:

pip install pandas

4. Running the Script

Place your input CSV file in the directory or specify the full path in the script.
Update the paths in the script for the input and output files.
Run the script:

python opening_hours_conversion.py

5. Deactivate Virtual Environment
Once done, you can deactivate the virtual environment:

deactivate

Troubleshooting
pip not found: Ensure that Python and pip are correctly installed and available in your system's PATH.
Python package installation errors: Ensure you have activated your virtual environment. Also, make sure you have the required permissions to install packages.