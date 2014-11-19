package client.listeners;

import java.util.List;

import client.models.Course;

public interface CourseListener {
	
	public void updateCourses(List<Course> courses);
	public void selectOnPatternTerm(String term);

}
