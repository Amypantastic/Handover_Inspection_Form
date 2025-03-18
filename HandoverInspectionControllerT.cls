public without sharing class HandoverInspectionControllerT {
    
    //wrapper class to store data
    public class FileWrapper {
        @AuraEnabled public String fileName { get; set; }
        @AuraEnabled public String base64Data { get; set; }
    }
    
    @AuraEnabled
    public static String saveAttachments(String recordId, List<FileWrapper> files) {
        List<ContentVersion> contentVersions = new List<ContentVersion>();
        
        for (FileWrapper file : files) {
            ContentVersion cv = new ContentVersion();
            cv.Title = file.fileName;
            cv.PathOnClient = '/' + file.fileName;
            cv.VersionData = EncodingUtil.base64Decode(file.base64Data);
            contentVersions.add(cv);
        }
        
        insert contentVersions;
        
        
        List<ContentVersion> insertedVersions = [
            SELECT Id, ContentDocumentId, Title 
            FROM ContentVersion 
            WHERE Id IN :contentVersions
        ];
        
        List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>();
        for (ContentVersion cv : insertedVersions) {
            ContentDocumentLink cdl = new ContentDocumentLink();
            cdl.ContentDocumentId = cv.ContentDocumentId;
            cdl.LinkedEntityId = recordId;
            cdl.ShareType = 'V';
            cdl.Visibility = 'AllUsers';
            cdlList.add(cdl);
        }
        
        insert cdlList;
        
        return 'Success';
    }
}