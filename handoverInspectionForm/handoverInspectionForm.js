import { LightningElement, api } from 'lwc';
import saveAttachments from '@salesforce/apex/HandoverInspectionControllerT.saveAttachments';
import generateAccessCode from '@salesforce/apex/TokenManager.generateAccessCode';
import checkSession from '@salesforce/apex/TokenManager.checkSession';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class handover_Inspection_Form extends LightningElement {
    @api recordId;

   //for session check
    sessionIsValid = false;
    formattedRemainingTime;
    token; 
    
    itemList = [{ id: 0, fileData: null }];
    keyIndex = 1;

    connectedCallback() {
        this.recomputeRowTypes();
        this.initializeSession(); 
    }

    // initialize session by checking URL or generating a token

    async initializeSession() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            // Use the token provided in the URL
            this.token = tokenFromUrl;
            this.validateSession(this.token);
        } else {
            // No token in URL, so generate a new token
            try {
                this.token = await generateAccessCode();
                this.validateSession(this.token);
            } catch (error) {
                console.error('Error generating access code:', error);
                this.sessionIsValid = false;
            }
        }
    }

//method to validate the session using the provided token
 validateSession(token) {
    checkSession({ encryptedCode: token })
        .then(result => {
            this.sessionIsValid = result.isValid;
            let expirationDate = new Date(result.expirationTime);
            
            // Format the date to "MM/DD/YYYY, h:mm am/pm"
            this.formattedRemainingTime = expirationDate.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).replace('AM','am').replace('PM','pm');
        })
        .catch(error => {
            console.error('Error checking session:', error);
            this.sessionIsValid = false;
        });
}

// rows and column logic, file upload
    addRow() {
        this.keyIndex++;
        this.itemList = [...this.itemList, { id: this.keyIndex, fileData: null }];
        this.recomputeRowTypes();
    }

    removeRow(event) {
        const rowIdToDelete = parseInt(event.currentTarget.dataset.id, 10);
        this.itemList = this.itemList.filter(item => item.id !== rowIdToDelete);
        this.recomputeRowTypes();
    }

    recomputeRowTypes() {
        this.itemList = this.itemList.map((item, index) => ({
            ...item,
            isFirst: index === 0,
            isLast: index === this.itemList.length - 1,
            isNotFirst: index !== 0
        }));
    }

 
    handleSave() {
        this.template.querySelector('lightning-record-edit-form').submit();
    }


    openfileUpload(event) {
        const fileInput = event.target;
        const fileId = parseInt(fileInput.dataset.id, 10);
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result.split(',')[1];
                this.itemList = this.itemList.map(item =>
                    item.id === fileId
                        ? {
                              ...item,
                              fileData: {
                                  fileName: file.name,
                                  base64Data: base64Data,
                                  fileType: file.type
                              }
                          }
                        : item
                );
            };
            reader.readAsDataURL(file);
        }
    }

    handleSuccess(event) {
        const recordId = event.detail.id;
        const filesToUpload = this.itemList
            .filter(item => item.fileData)
            .map(item => ({
                fileName: item.fileData.fileName,
                base64Data: item.fileData.base64Data
            }));

        if (filesToUpload.length === 0) {
            this.showToast('Info', 'No files to upload', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return;
        }

        saveAttachments({ recordId: recordId, files: filesToUpload })
            .then(result => {
                this.showToast('Success', 'All files are uploaded successfully', 'success');
                getRecordNotifyChange([{ recordId: recordId }]);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                this.showToast('Error', error.body?.message || 'Upload failed', 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}