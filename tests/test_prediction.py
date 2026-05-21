from base import get_driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def test_valid_prediction():

    driver = get_driver()

    driver.get("http://localhost:3000")

    lyrics = driver.find_element(By.ID, "lyrics-input")

    lyrics.send_keys("अंबेचा झाडाखाली गावकरी गातात")

    button = driver.find_element(By.ID, "predict-btn")

    button.click()

    result = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.ID, "prediction-result")
        )
    )
    
    assert result.text != ""

    driver.save_screenshot(
        "tests/screenshots/prediction_success.png"
    )

    time.sleep(2)

    driver.quit()