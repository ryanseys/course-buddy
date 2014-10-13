package client.models;

import java.util.LinkedList;
import java.util.List;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Course {
	
	public final String dept, name;
	public final int id, code;
	
	public Course(int id, String dept, int code, String name){
		this.id = id;
		this.dept = dept;
		this.code = code;
		this.name = name;
	}
	
	@Override
	public String toString(){
		return String.format("%s%d: %s", dept, code, name);
	}
		
	public static List<Course> generateCourseList(JsonElement coursesEle){
		List<Course> courses = new LinkedList<>();
		
		// Interpet array of courses
		if (coursesEle.isJsonArray()){
			for (JsonElement courseEle : coursesEle.getAsJsonArray()){
				if (courseEle.isJsonObject()){
					courses.add(buildCourse(courseEle.getAsJsonObject()));
				} else {
					throw new IllegalArgumentException("Invalid courses json");
				}
			}
		}
		
		// Otherwise, try to interpret json as single course
		else if (coursesEle.isJsonObject()){
			courses.add(buildCourse(coursesEle.getAsJsonObject()));
		}
		
		return courses;
	}
	
	private static Course buildCourse(JsonObject courseObj){
		return new Course(
			courseObj.get("id").getAsInt(),
			courseObj.get("dept").getAsString(),
			courseObj.get("code").getAsInt(),
			courseObj.get("name").getAsString()
		);
	}
}
