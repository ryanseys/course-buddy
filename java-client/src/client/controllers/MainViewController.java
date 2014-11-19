package client.controllers;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import javax.swing.JOptionPane;

import client.listeners.CourseListener;
import client.listeners.ProgramListener;
import client.listeners.SubmitListener;
import client.listeners.YesNoListener;
import client.models.Course;
import client.models.Program;

import com.google.gson.JsonElement;

/**
 * This is the Controller for communicating with the MainView.
 * 
 * It implements several listeners for communication with the view
 * and collects all the information that the user enters on the view.
 * 
 * Some events will result in the controller making synchronous API
 * calls to the server, and then sending those results back to the view.
 * 
 * When the user clicks submit, this gathers all the information and
 * presents it to the user in the form of a JDialog.
 * 
 * @author Andrew O'Hara
 */
public class MainViewController implements ProgramListener, CourseListener, YesNoListener, SubmitListener {
	
	private final Collection<ProgramListener> programListeners = new LinkedList<>();
	private final Collection<CourseListener> courseListeners = new LinkedList<>();
	
	private final ApiHandler apiHandler = new ApiHandler();
	
	private Collection<Course> coursesTaken = new LinkedList<>();
	private Program selectedProgram;
	private Boolean onPattern;
	private String onPatternTerm;
	
	public void refresh(){
		try {
			URL url = apiHandler.getUrl("programs.php");
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
	public void selectProgram(Program program) {
		selectedProgram = program;
		updateCourseList();
	}

	@Override
	public void yesNoSelection(boolean value) {
		onPattern = value;
		updateCourseList();
	}
	
	@Override
	public void updateCourses(List<Course> courses) {
		coursesTaken = courses;
	}
	
	@Override
	public void submit() {
		if (selectedProgram != null && onPattern != null){
			StringBuilder message = new StringBuilder();
			message.append("Data Gathered:\n\n");
			message.append("Program: ").append(selectedProgram).append("\n");
			message.append("On Pattern: ").append(onPattern).append("\n");
			message.append("\n");
			message.append("On Pattern Term: ").append(onPatternTerm).append("\n");
			message.append("\n");
			message.append("Courses Taken:\n");
			message.append("\n");
			for (Course course : coursesTaken){
				message.append(course).append("\n");
			}
			
			JOptionPane.showMessageDialog(null, message.toString());
		}
	}
	
	private void updateCourseList(){
		final List<Course> courses = new LinkedList<>();
		
		if (selectedProgram != null && onPattern != null && !onPattern){
			try {
				URL url = apiHandler.getUrl("courses.php?program=" + selectedProgram.id);
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

	public void selectOnPatternTerm(String term){
		onPatternTerm = term;
	}
}
