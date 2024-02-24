# Substrata Test Task
## TypeScript Koa API for Microsoft Outlook Email Integration
TypeScript Koa server application to authenticate a user with the Microsoft
Graph API and retrieve emails from their Microsoft Outlook mailbox.

## Getting Started

### Prerequisites
- Nodejs 16.x or later
- npm or yarn

### Installation

- Create .env file with the following structure:

```
MS_CLIENT_ID="some-client-id"
MS_CLIENT_SECRET="some-client-secret"
MS_TENANT_ID="some-tenant-id"
MS_SCOPE="https://graph.microsoft.com/Mail.Read"
PORT=3030 
```
The PORT variable is optional

- Install the dependencies
```
npm install 
```
or
```
yarn install
```

## Usage

Start application
```
npm run start
```
Start application in developer mode

```
npm run dev
```

After starting in either mode go to http://localhost:3030/

The default port is 3030 unless overridden in the .env file.

## Endpoints

All the endpoint do not require any params to work

**1. /signin**

Generates authorization URL for signing into Microsoft with the correct permissions to read the user's Outlook emails.
Th URL redirects users to the /auth-response endpoint

**2. /auth-response**

Receives an authentication token and then stores it in memory for use in subsequent API requests.

**3. /emails**

Fetch the last five emails from the authenticated user's Outlook mailbox using the Microsoft Graph API.
This endpoint requires previously saved token
