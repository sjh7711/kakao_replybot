write64 = function (file,base64) {
	   var base64Array=new java.lang.String(base64).getBytes();
	   var fileArray=org.apache.commons.codec.binary.Base64.decodeBase64(base64Array);
	   var is=new java.io.ByteArrayInputStream(fileArray);
	   var os=new java.io.FileOutputStream(file);
	   var len=0;
	   var buf=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,1000)
	   while((len=is.read(buf))!=-1){
	      os.write(buf,0,len);
	   }
	   is.close();
	   os.close();
	}

read64 = function (file) {
	   var is=new java.io.FileInputStream(file);
	   var os=new java.io.ByteArrayOutputStream();
	   var len=0;
	   var buf=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,1000)
	   while((len=is.read(buf))!=-1){
	      os.write(buf,0,len);
	   }
	   is.close();
	   os.close();
	   var fileArray=os.toByteArray();
	   var str=new java.lang.String(org.apache.commons.codec.binary.Base64.encodeBase64(fileArray));
	   return str;
	}