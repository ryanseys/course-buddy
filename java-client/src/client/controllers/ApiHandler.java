package client.controllers;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.MalformedURLException;
import java.net.URL;

import client.models.Constants;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Controller class for making synchronous REST API Requests.
 * 
 * Responses are returned as JsonElements.
 * 
 * @author Andrew O'Hara
 */
public class ApiHandler {
	
	private final String ERROR = "error";
	
	private final JsonParser parser = new JsonParser();
	
	public JsonElement send(URL url) throws IOException{
		JsonElement ele;
		
		// Make Request
		try(Reader r = new InputStreamReader(url.openStream())){
			ele = parser.parse(r);
		}
		
		// Check for Error
		if (ele.isJsonObject()){
			JsonObject obj = ele.getAsJsonObject();
			if (obj.has(ERROR)){
				throw new IOException(String.format("%s: %s", ERROR, obj.get(ERROR).getAsString()));
			}
		}
		
		// Return Result
		return ele;
	}
	
	public URL getUrl(String path) throws MalformedURLException{
		return new URL(String.format("http://%s:%d/%s", Constants.HOST, Constants.PORT, path));
	}

}
