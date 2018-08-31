//https://github.com/jamestalmage/s3-static-site-uploader
console.log("barry");
module.exports = {
	credentials:"aws-credentials.json",
	bucketName:"storymarmalade",
	patterns:[	
		"index.htm","about.htm","*.css"
	]
}