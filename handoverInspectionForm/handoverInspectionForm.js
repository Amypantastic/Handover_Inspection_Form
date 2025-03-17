import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveAttachment from '@salesforce/apex/HandoverInspectionController.saveAttachment';

export default class HandoverInspectionForm extends LightningElement {
     @api recordId;
    fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            console.log(base64)
            saveAttachment({ 
                recordId: this.recordId, 
                fileName: file.name, 
                base64Data: base64,     
                contentType: file.type 
            }).then(result => {
                console.log('File saved successfully: ' + result);
            }).catch(error => {
                console.error('Error saving file: ' + error);
            });
        }
        reader.readAsDataURL(file)
    }
      handleClick(){
        this.template.querySelector('lightning-record-edit-form').submit();
        const {base64, filename, recordId} = this.fileData
        uploadFile({ base64, filename, recordId }).then(result=>{
            this.fileData = null
            let title = `${filename} uploaded successfully!!`
            this.toast(title)
        })
    }

    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }
}