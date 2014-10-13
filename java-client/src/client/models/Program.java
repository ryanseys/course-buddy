package client.models;

import java.util.LinkedList;
import java.util.List;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Program {
	
	public final int id;
	public final String name;
	
	public Program(int id, String name){
		this.id = id;
		this.name = name;
	}
	
	@Override
	public String toString(){
		return name;
	}
	
	public static List<Program> generateProgramList(JsonElement programsEle){
		List<Program> programs = new LinkedList<>();
		
		// Interpet array of programs
		if (programsEle.isJsonArray()){
			for (JsonElement programEle : programsEle.getAsJsonArray()){
				if (programEle.isJsonObject()){
					programs.add(buildProgram(programEle.getAsJsonObject()));
				} else {
					throw new IllegalArgumentException("Invalid courses json");
				}
			}
		}
		
		// Otherwise, try to interpret json as single course
		else if (programsEle.isJsonObject()){
			programs.add(buildProgram(programsEle.getAsJsonObject()));
		}
		
		return programs;
		
	}
	
	private static Program buildProgram(JsonObject obj){
		return new Program(
			obj.get("id").getAsInt(),
			obj.get("name").getAsString()
		);
	}
}
