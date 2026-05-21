from base import get_driver
import time

driver = get_driver()

driver.get("http://localhost:3000")

driver.save_screenshot(
    "screenshots/homepage.png"
)

time.sleep(3)

driver.quit()