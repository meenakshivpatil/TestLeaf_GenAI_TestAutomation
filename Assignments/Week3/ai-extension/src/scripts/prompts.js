/**
 * Collection of default prompts for different use cases (ICE POT Format)
 */
export const DEFAULT_PROMPTS = {
 
  /**
   * Selenium Java Page Object Prompt (No Test Class)
   */
  SELENIUM_JAVA_PAGE_ONLY: `
    Instructions:
    - Generate ONLY a Selenium Java Page Object Class (no test code).
    - Add JavaDoc for methods & class.
    - Use Selenium 2.30+ compatible imports.
    - Use meaningful method names.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`java
    package com.testleaf.pages;

    /**
     * Page Object for Component Page
     */
    public class ComponentPage {
        // Add methods as per the DOM
    }
    \`\`\`

    Persona:
    - Audience: Automation engineer focusing on maintainable POM structure.

    Output Format:
    - A single Java class inside a \`\`\`java\`\`\` block.

    Tone:
    - Clean, maintainable, enterprise-ready.
  `,

  /**
   * Cucumber Feature File Only Prompt
   */
  CUCUMBER_ONLY: `
    Instructions:
    - Generate ONLY a Cucumber (.feature) file.
    - Use Scenario Outline with Examples table.
    - Make sure every step is relevant to the provided DOM.
    - Do not combine multiple actions into one step.
    - Use South India realistic dataset (names, addresses, pin codes, mobile numbers).
    - Use dropdown values only from provided DOM.
    - Generate multiple scenarios if applicable.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
      | "testuser" | "testpass"|
      | "admin"    | "admin123"|
    \`\`\`

    Persona:
    - Audience: BDD testers who only need feature files.

    Output Format:
    - Only valid Gherkin in a \`\`\`gherkin\`\`\` block.

    Tone:
    - Clear, structured, executable.
  `,

  /**
   * Cucumber with Step Definitions
   */
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: `
    Instructions:
    - Generate BOTH:
      1. A Cucumber .feature file.
      2. A Java step definition class for selenium.
    - Do NOT include Page Object code.
    - Step defs must include WebDriver setup, explicit waits, and actual Selenium code.
    - Use Scenario Outline with Examples table (South India realistic data).

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
\      | "admin"    | "admin123"|
    \`\`\`

    \`\`\`java
    package com.leaftaps.stepdefs;

    import io.cucumber.java.en.*;
    import org.openqa.selenium.*;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.*;

    public class LoginStepDefinitions {
        private WebDriver driver;
        private WebDriverWait wait;

        @io.cucumber.java.Before
        public void setUp() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.manage().window().maximize();
        }

        @io.cucumber.java.After
        public void tearDown() {
            if (driver != null) driver.quit();
        }

        @Given("I open the login page")
        public void openLoginPage() {
            driver.get("\${pageUrl}");
        }

        @When("I type {string} into the Username field")
        public void enterUsername(String username) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
            el.sendKeys(username);
        }

        @When("I type {string} into the Password field")
        public void enterPassword(String password) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("password")));
            el.sendKeys(password);
        }

        @When("I click the Login button")
        public void clickLogin() {
            driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
        }

        @Then("I should be logged in successfully")
        public void verifyLogin() {
            WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
            assert success.isDisplayed();
        }
    }
    \`\`\`

    Persona:
    - Audience: QA engineers working with Cucumber & Selenium.

    Output Format:
    - Gherkin in \`\`\`gherkin\`\`\` block + Java code in \`\`\`java\`\`\` block.

    Tone:
    - Professional, executable, structured.
  `
};

/**
 * Helper function to escape code blocks in prompts
 */
function escapeCodeBlocks(text) {
  return text.replace(/```/g, '\\`\\`\\`');
}

/**
 * Function to fill template variables in a prompt
 */
export function getPrompt(promptKey, variables = {}) {
  let prompt = DEFAULT_PROMPTS[promptKey];
  if (!prompt) {
    throw new Error(`Prompt not found: ${promptKey}`);
  }

  Object.entries(variables).forEach(([k, v]) => {
    const regex = new RegExp(`\\$\\{${k}\\}`, 'g');
    prompt = prompt.replace(regex, v);
  });

  return prompt.trim();
}

export const CODE_GENERATOR_TYPES = {
  SELENIUM_JAVA_PAGE_ONLY: 'Selenium-Java-Page-Only',
  CUCUMBER_ONLY: 'Cucumber-Only',
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: 'Cucumber-With-Selenium-Java-Steps',
};

/**
 * Playwright TypeScript Page Object Prompt
 */
DEFAULT_PROMPTS.PLAYWRIGHT_TYPESCRIPT_PAGE_ONLY = `
    Instructions:
    - Generate ONLY a Playwright TypeScript Page Object (no test code).
    - Use Playwright's Page object pattern and idiomatic async/await.
    - Add TSDoc for methods & class.
    - Use meaningful method names and selectors as per DOM.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`typescript
    import { Page } from '@playwright/test';

    /**
     * Page Object for Component Page
     */
    export class ComponentPage {
      private page: Page;

      constructor(page: Page) {
        this.page = page;
      }

      /**
       * Navigate to the page URL
       */
      async navigate(url: string) {
        await this.page.goto(url);
      }

      // Add methods mapped to DOM elements
    }
    \`\`\`

    Persona:
    - Audience: Automation engineer using Playwright with TypeScript.

    Output Format:
    - A single TypeScript class inside a \`\`\`typescript\`\`\` block.

    Tone:
    - Clean, maintainable, enterprise-ready.
  `;

// Add to types map
CODE_GENERATOR_TYPES.PLAYWRIGHT_TYPESCRIPT_PAGE_ONLY = 'Playwright-Typescript-Page-Only';


/**
 * Test Data Prompt
 */
DEFAULT_PROMPTS.DATA = `
    Instructions:
    - For every input field, generate random test data based on number of records
    - Use Indian realistic dataset (like names, addresses, pin codes, mobile numbers).
    - Include realistic data variations (e.g., different names, locations).
    - Ensure data privacy and compliance (e.g., anonymize sensitive information).
    - Generate realistic data distributions (e.g., age, income).
    - Generate --> multiple random test data records in JSON format.
    

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    [
  {
    "applicant_id": 1,
    "name": "Ananya Sharma",
    "age": 25,
    "address": "123 MG Road, Pune, Maharashtra",
    "employment_status": "Full-time",
    "annual_income": 35000,
    "credit_score": 720,
    "credit_history": "No prior credit",
    "preferred_card_type": "Student Credit Card",
    "card_features": "No annual fee, Cashback rewards",
    "loan_amount_requested": 5000,
    "card_approval_decision": "Approved",
    "reasons_for_rejection": null
  },
  {
    "applicant_id": 2,
    "name": "Rajesh Kumar",
    "age": 35,
    "address": "456 Residency Road, Bengaluru, Karnataka",
    "employment_status": "Full-time",
    "annual_income": 95000,
    "credit_score": 810,
    "credit_history": "Excellent",
    "preferred_card_type": "Premium Rewards Card",
    "card_features": "Travel miles, Higher credit limit, No foreign transaction fees",
    "loan_amount_requested": 20000,
    "card_approval_decision": "Approved",
    "reasons_for_rejection": null
  },
  {
    "applicant_id": 3,
    "name": "Meena Reddy",
    "age": 55,
    "address": "789 Banjara Hills, Hyderabad, Telangana",
    "employment_status": "Retired",
    "annual_income": 22000,
    "credit_score": 850,
    "credit_history": "Excellent",
    "preferred_card_type": "Cashback Credit Card",
    "card_features": "0% APR, No annual fee, Cashback on groceries",
    "loan_amount_requested": 1500,
    "card_approval_decision": "Approved",
    "reasons_for_rejection": null
  }
]


    Persona:
    - Audience: Automation engineer.

    Output Format:
    - Single JSON array.

    Tone:
    - Clean, maintainable, enterprise-ready.
  `;

// Add to types map
CODE_GENERATOR_TYPES.DATA = 'Data';
