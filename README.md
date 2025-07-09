# Playwright Booking E2E
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Test Execution](#test-execution)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Playwright Booking E2E** is an end-to-end (E2E) automated testing project for a booking application, leveraging [Playwright](https://playwright.dev/) for browser automation. The project is designed to validate critical user flows such as authentication, booking creation, updates, and cancellations, ensuring application reliability and user experience.

## Features

- Automated E2E tests for booking workflows and authentication
- Page Object Model (POM) for maintainable and reusable test code
- Support for multiple environments via environment variables
- Data-driven testing with fixtures and test data files
- Custom helpers for API setup, teardown, and data seeding
- Configurable test runner, browser options, and reporting

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Playwright_Booking-1
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and update values as needed.

## Project Structure

```
.
├── tests/                        # E2E test files organized by feature or flow
│   ├── booking.spec.js           # Booking workflow test cases (create, update, cancel)
│   ├── login.spec.js             # Authentication test cases (login, logout, invalid credentials)
│   ├── helpers/                  # Shared utilities and custom commands
│   │   └── apiHelpers.js         # API setup/teardown, data seeding functions
│   └── data/                     # Test data files (JSON, CSV, etc.)
├── fixtures/                     # Static test data and reusable fixtures
│   └── users.json                # Example: user accounts for login tests
├── pages/                        # Page Object Model classes for UI abstraction
│   ├── BookingPage.js            # Booking-related selectors and actions
│   ├── LoginPage.js              # Authentication page selectors and actions
│   └── BasePage.js               # Common page methods/utilities
├── playwright.config.js          # Playwright configuration (browsers, reporters, etc.)
├── package.json                  # Project metadata, scripts, dependencies
├── .env                          # Environment variables (base URL, credentials)
├── .env.example                  # Example environment file
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

### Directory Details

- **tests/**: Contains all E2E test scripts, organized by feature. Includes helpers for reusable logic and a data folder for parameterized tests.
- **fixtures/**: Stores static data and fixtures to ensure consistent test environments.
- **pages/**: Implements the Page Object Model, encapsulating UI selectors and actions for maintainable tests.
- **playwright.config.js**: Central configuration for Playwright, including browser settings, timeouts, and reporters.
- **.env / .env.example**: Manage sensitive or environment-specific variables outside of code.
- **package.json**: Defines dependencies, scripts (e.g., `test`, `lint`), and project metadata.

## Test Execution

### Run All Tests

```bash
npm test
# or
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/booking.spec.js
```

### Generate HTML Report

```bash
npx playwright show-report
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

## Configuration

- **playwright.config.js**: Customize browsers, base URL, timeouts, retries, and reporters.
- **.env**: Set environment-specific variables (e.g., `BASE_URL`, credentials).
- **Test Data**: Place reusable test data in `fixtures/` or `tests/data/`.

## Best Practices

- Use the Page Object Model for maintainable and scalable test code.
- Keep test data and fixtures separate from test logic.
- Use helpers for API setup/teardown to ensure test isolation.
- Parameterize tests for broader coverage.
- Store sensitive data in environment variables, not in code.

## Contributing

1. Fork the repository and create your branch.
2. Make your changes and add tests as needed.
3. Ensure all tests pass (`npm test`).
4. Submit a pull request with a clear description.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
