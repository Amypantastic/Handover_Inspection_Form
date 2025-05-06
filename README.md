# Handover_Inspection_Form

Handover Inspection Form
Purpose & Functionality: This repository implements a Salesforce form for creating “Handover Inspection” records on the Lightning platform. Users fill out a custom object (Handover_Inspection__c) via a Lightning Web Component (LWC) form, setting fields like Priority, Status, Due Date, Initiated By, and Comment. After submission, any attached image files are uploaded to the newly created record using Apex (via Salesforce ContentVersion/ContentDocumentLink). The code also includes a token-based session check – if a valid token parameter is not present (or expired), the form shows a “Session Expired” message, otherwise it initializes a new access token via a custom Apex method.
Key Features & User Interactions: The LWC UI allows dynamic attachment uploads: users can click Add Row to insert multiple <input type="file"> fields (accepting .png, .jpeg), see chosen file names, and remove rows if needed. Pressing Save triggers the record creation (<lightning-record-edit-form> in the component) and then the custom saveAttachments Apex method to persist files. Informational toast messages notify the user of success or errors (e.g. “No files to upload” or “All files are uploaded successfully”). The component also displays a session timeout view if sessionIsValid is false (controlled by the TokenManager Apex methods). Overall, it’s a guided form experience with real-time add/remove attachment rows, in-context feedback, and guarded access via a time-limited token.
Technologies Used: The project is built with Salesforce Lightning technology: a Lightning Web Component (LWC) (HTML + JavaScript + CSS) on the front end and Apex classes on the back end. According to GitHub’s breakdown, the code is ~36% JavaScript (for the LWC), ~30% Apex (controller code), ~27% HTML and ~7% CSS
github.com
. The LWC uses Salesforce UI modules (e.g. lightning-record-edit-form, lightning-input, ShowToastEvent, getRecordNotifyChange) and calls server-side Apex via @salesforce/apex imports. On Apex side, it uses ContentVersion and ContentDocumentLink to handle file attachments, and a TokenManager class with CryptoUtil for encryption/decryption of session tokens (using a custom Token__mdt metadata for expiration). In sum, it leverages Salesforce’s Lightning framework (LWC) and standard Apex libraries for record and file handling.
Project Structure & Components: The repository has the following key parts:
handoverInspectionForm/ – a directory containing the Lightning web component files: handoverInspectionForm.html, .js, .css and the metadata handoverInspectionForm.js-meta.xml. These define the front-end form interface, styling, and its targets (e.g. Lightning App Page, Record Page, Community page).
Apex Classes: At the root there are two main Apex classes:
HandoverInspectionControllerT.cls – an Apex controller with an @AuraEnabled method saveAttachments(recordId, files). It loops over uploaded files (sent as Base64 data) to create ContentVersion records and link them to the given record.
TokenManager.cls – handles token/session logic. It has methods like generateAccessCode() to create an encrypted expiration timestamp, and checkSession(encryptedCode) to decrypt and verify if the current time is before that expiration. (It also has a commented-out email-sending helper for notifying about session links.)
Metadata files: Each Apex class has its corresponding .cls-meta.xml (e.g. HandoverInspectionControllerT.cls-meta.xml) and the LWC folder has the .js-meta.xml declaring targets.
README.md: The only documentation file in the repo is a minimal README.md (just the project title with no further description).
These files can be seen on GitHub: for example, the listing shows the LWC folder and the two Apex classes (with their XML) alongside the README
github.com
github.com
.
Deployment & Usage: There are no explicit setup instructions in the repo. Presumably, one would deploy this into a Salesforce org (e.g. via SFDX or Metadata API) so that the LWC and Apex classes are active. The LWC is exposed to various targets (Record Pages, App Pages, Community pages, etc., as per its metadata). Users should ensure the custom object Handover_Inspection__c exists with the specified fields. For session tokens, a Custom Metadata Type Token__mdt (“Site_Expiry”) is referenced to compute expiration. In practice, accessing the component with no token URL parameter causes generateAccessCode() to run (setting sessionIsValid = true), but administrators may want to embed or email links including the ?token=... parameter if using Salesforce Sites or Communities.
Issues & Contributions: The repository currently shows no open issues or pull requests
github.com
. It has 0 stars, 0 forks and essentially one watcher (the owner) on GitHub
github.com
github.com
, indicating no external community activity so far. All commits (3 in total) were authored by the owner (“Amypantastic”) and there are no outside contributions noted. In summary, this appears to be a single-contributor project with minimal public visibility or reported issues.
