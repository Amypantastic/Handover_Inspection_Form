public class TokenManager {
    
    @AuraEnabled(cacheable=true)
    public static DateTime remaining_time() {
        Token__mdt token = Token__mdt.getInstance('Site_Expiry');
        // Here we are adding time from metadata, which is in hours
		
        return System.now().addHours(Integer.valueOf(token.Expiration_Hour__c));
    }
    
    @AuraEnabled(cacheable=true)
    public static String generateAccessCode() {
        DateTime expirationTime = remaining_time();
        String accessCode = String.valueOf(expirationTime.getTime());
		system.debug(accessCode);
        String encryptedCode = CryptoUtil.encrypt(accessCode);
		system.debug(encryptedCode);
        return encryptedCode;
    }
 /*
   @AuraEnabled
    public static DateTime decryptAccessCode(String encryptedCode) {
        String decryptedCode = CryptoUtil.decrypt(encryptedCode);
        // Convert milliseconds back to DateTime
        return DateTime.newInstance(Long.valueOf(decryptedCode));

    }

	@AuraEnabled(cacheable=true)
    public static Boolean isSessionValid(String encryptedCode) {
        try {
            DateTime expirationTime = decryptAccessCode(encryptedCode);
			system.debug(System.now() < expirationTime);
            return System.now() < expirationTime;
        } catch(Exception e) {
            return false;
        }
    }
*/
    
    @AuraEnabled
    public static Map<String, Object> checkSession(String encryptedCode) {
        Map<String, Object> result = new Map<String, Object>();
       
            String decryptedCode = CryptoUtil.decrypt(encryptedCode);
            DateTime expirationTime = DateTime.newInstance(Long.valueOf(decryptedCode));
			system.debug(expirationTime);
            Boolean isValid = System.now() < expirationTime;

            result.put('isValid', isValid);
			system.debug(isValid);
            result.put('expirationTime', expirationTime);
			system.debug(expirationTime);
        return result;
    }

   public static void sendSessionExpiredEmail(DateTime expirationTime, String encryptedCode) {
        String subject = 'Handover Inspection Form Notification';
        String token = encryptedCode;
        String expirationTimeFormatted = expirationTime.format();
        
        String body = 'Hi, this is your handover inspection form. You can access it using the link below:\n\n\n'+
            '<a href="https://cloudsciencelabs19-dev-ed.develop.my.salesforce-sites.com/inspections/?token=' + 
            token + '">Please click here</a>\n\n' +
            'Expiration Time: ' + expirationTimeFormatted;
        
        String toAddress = 'amittiwari.at254@gmail.com'; 
        
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { toAddress });
        email.setSubject(subject);
        email.setHtmlBody(body);
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }
   

}

/*
anonymous Code to send mail

String token = TokenManager.generateAccessCode();
System.debug('Generated Token: ' + token);


Map<String, Object> sessionResult = TokenManager.checkSession(token);
System.debug('Session Result: ' + sessionResult);


Boolean isValid = (Boolean)sessionResult.get('isValid');
DateTime expirationTime = (DateTime)sessionResult.get('expirationTime');

System.debug('Is Session Valid: ' + isValid);
System.debug('Expiration Time: ' + expirationTime);


//Mail
TokenManager.sendSessionExpiredEmail(expirationTime, token);
System.debug('email sent.');


*/