package client.controllers;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import javax.swing.JOptionPane;

import com.google.gson.JsonElement;

import client.listeners.CourseListener;
import client.listeners.ProgramListener;
import client.models.Constants;
import client.models.Course;
import client.models.Program;

public class MainViewController implements ProgramListener {
	
	private final Collection<ProgramListener> programListeners = new LinkedList<>();
	private final Collection<CourseListener> courseListeners = new LinkedList<>();
	
	private final ApiHandler apiHandler = new ApiHandler();
	
	public void refresh(){
		try {
			URL url = new URL(String.format("http://%s/programs.php", Constants.HOST));
			JsonElement response = apiHandler.send(url);
			List<Program> programs = Program.generateProgramList(response);
			for (ProgramListener l : programListeners){
				l.updatePrograms(programs);
			}	
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			JOptionPane.showMessageDialog(null, e.toString());
		}
	}
	
	public void addProgramListener(ProgramListener l){
		programListeners.add(l);
	}
	
	public void addCourseListener(CourseListener l){
		courseListeners.add(l);
	}

	@Override
	public void updatePrograms(List<Program> programs) {
		// No Action
	}

	@Override
	public void selectProgram(Program program, boolean onPattern) {
		final List<Course> courses = new LinkedList<>();
		
		
		if (program != null && onPattern){
			try {
				URL url = new URL(String.format("http://%s/courses.php?program=%d", Constants.HOST, program.id));
				JsonElement response = apiHandler.send(url);
				courses.addAll(Course.generateCourseList(response));
			} catch (MalformedURLException e) {
				throw new RuntimeException(e);
			} catch (IOException e) {
				JOptionPane.showMessageDialog(null, e.toString());
			}
		}
		
		for (CourseListener l : courseListeners){
			l.updateCourses(courses);
		}
	}

}
