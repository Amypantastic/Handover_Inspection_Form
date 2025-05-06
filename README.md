# Handover Inspection Form

## Purpose & Functionality

This Salesforce project implements a **Lightning Web Component (LWC)**-based form to create "**Handover Inspection**" records (custom object: `Handover_Inspection__c`).

Users can:

* Fill out fields like **Priority**, **Status**, **Due Date**, **Initiated By**, and **Comments**.
* Upload image attachments with the form.
* Submit the form, triggering record creation and file uploads.

Access to the form is controlled by a **token-based session check**:

* If a valid token is not present or expired, a "Session Expired" message is shown.
* If valid, a new access session is initiated using Apex.

## Key Features & User Interactions

* **Dynamic File Uploading**:

  * Users can add/remove file input rows dynamically.
  * Accepted formats: `.png`, `.jpeg`.
* **Submission Workflow**:

  * Clicking **Save** creates the record.
  * Files are uploaded via Apex (`saveAttachments` method).
  * **Toast notifications** inform users of upload results or errors.
* **Session Management**:

  * Token parameter (`?token=`) used to validate session expiration.
  * Tokens are encrypted and managed via Apex (`TokenManager.cls`).

## Technologies Used

* **Frontend**:

  * Lightning Web Components: HTML, JavaScript, CSS.
  * Salesforce UI modules: `lightning-record-edit-form`, `lightning-input`, `ShowToastEvent`.
  * Deployed via **Aura Component** and **Visualforce Page** to serve the LWC on a **Salesforce Public Site**.
* **Backend**:

  * Apex controllers with `@AuraEnabled` methods.
  * File handling: `ContentVersion`, `ContentDocumentLink`.
  * Token handling: custom encryption via `CryptoUtil`, `Token__mdt`.

**Code Composition (GitHub breakdown):**

* JavaScript: \~36%
* Apex: \~30%
* HTML: \~27%
* CSS: \~7%

## Project Structure

* **LWC Folder: `handoverInspectionForm/`**

  * `handoverInspectionForm.html`
  * `handoverInspectionForm.js`
  * `handoverInspectionForm.css`
  * `handoverInspectionForm.js-meta.xml`
* **Apex Classes:**

  * `HandoverInspectionControllerT.cls`: handles file uploads.
  * `TokenManager.cls`: generates and validates encrypted tokens.
* **Aura Component & Visualforce Page:**

  * Used to expose the LWC on a Salesforce Public Site.
* **Metadata Files:**

  * Each Apex class has an associated `.cls-meta.xml` file.
  * LWC has a `.js-meta.xml` for component exposure.
* **README.md**: Basic title only (this file is an updated version).

## Deployment & Usage

* Recommended steps:

  * Deploy metadata using **SFDX** or **Metadata API** to a Salesforce org.
  * Ensure the object `Handover_Inspection__c` and metadata `Token__mdt` are present.
  * Expose the LWC via an **Aura wrapper component** and embed it in a **Visualforce Page**.
  * Publish the Visualforce Page on a **Salesforce Public Site**.
  * Provide access links using the `?token=` parameter for session control.

