from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options 
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import pandas as pd

# Path to GeckoDriver
gecko_driver_path = ""
firefox_binary_path = "/Applications/Firefox.app/Contents/MacOS/firefox"

# Initialize the webdriver
def initialize_driver(gecko_driver_path, firefox_binary_path):
    service = Service(executable_path=gecko_driver_path)
    
    options = Options()
    options.binary_location = firefox_binary_path
    
    driver = webdriver.Firefox(service=service, options=options)
    return driver

# Read credentials
def read_credentials(file_path):
    df = pd.read_csv(file_path)
    return df.iloc[0]['username'], df.iloc[0]['password']

# Read recipient
def read_recipient(file_path):
    df = pd.read_csv(file_path)
    return df.iloc[0]['recipient']   
        
        
# Login to LinkedIn
def linkedin_login(driver, username, password):
    driver.get("https://www.linkedin.com/login")
    driver.implicitly_wait(5)

    username_field = driver.find_element(By.ID, "username")
    password_field = driver.find_element(By.ID, "password")

    username_field.send_keys(username)
    password_field.send_keys(password)

    password_field.send_keys(Keys.RETURN)
    time.sleep(5)


# Send a message
def send_message(driver, recipient_name, message_file):
    driver.get("https://www.linkedin.com/messaging/")
    wait = WebDriverWait(driver, 20)

    try:
        new_message_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'msg-conversations-container__compose-btn')]")))
        new_message_button.click()
        print("New message button clicked.")
    except TimeoutException:
        print("New message button was not found on the page within the time limit.")
        return


    # Wait for the recipient field to be visible and enter the recipient's name
    try:
        recipient_field_locator = (By.CSS_SELECTOR, "input.msg-connections-typeahead__search-field")
        recipient_field = wait.until(EC.visibility_of_element_located(recipient_field_locator))
        recipient_field.send_keys(recipient_name)  
        time.sleep(2)  
        recipient_field.send_keys(Keys.RETURN) 
        time.sleep(2)  
    except TimeoutException:
        print("Either the recipient field was not found within the time limit, or the suggestions did not appear.")

    # Wait for the message box to become available and visible
    try:
        message_box_locator = (By.CSS_SELECTOR, "div.msg-form__contenteditable")
        message_box = wait.until(EC.visibility_of_element_located(message_box_locator))
    except TimeoutException:
        print("Message box was not found or not interactable within the time limit.")
        message_box = None

    # Read the message from 'message.txt' file
    try:
        with open('message.txt', 'r') as file:
            message_text = file.read()
    except FileNotFoundError:
        print("The message.txt file was not found.")
        message_text = ""

    # Type out the message
    if message_text and message_box:
        try:
            # Wait for the message box to be ready and then click on it
            print("Waiting for the message box to be ready...")
            wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.msg-form__contenteditable")))
            message_box.click() 
            print("Message box is ready. Typing the message...")

            for character in message_text:
                message_box.send_keys(character)
                time.sleep(0.1) 

            send_button_locator = (By.CSS_SELECTOR, "button.msg-form__send-button.artdeco-button--1")
            send_button = wait.until(EC.element_to_be_clickable(send_button_locator))
            send_button.click()
            print("Message was sent successfully.")
        except Exception as e:
            print(f"An error occurred while sending the message: {e}")
    else:
        if not message_box:
            print("Message box was not interactable.")
        else:
            print("No message to send.")
            
            
# Main function
def main():
    gecko_driver_path = ""
    credentials_file = 'credentials.csv'  
    recipient_file = 'recipient.csv'

    username, password = read_credentials(credentials_file)
    recipient_name = read_recipient(recipient_file) 
    # recipient_name = ""
    print(f"Sending message to: {recipient_name}")
    
    driver = initialize_driver(gecko_driver_path, firefox_binary_path)
    linkedin_login(driver, username, password)
    send_message(driver, recipient_name, 'message.txt')

if __name__ == "__main__":
    main()
    
   
