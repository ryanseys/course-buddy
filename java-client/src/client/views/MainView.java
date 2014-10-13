package client.views;

import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

import client.listeners.CourseListener;
import client.listeners.ProgramListener;
import client.models.Course;
import client.models.Program;

public class MainView implements ViewComponent, ProgramListener, CourseListener {
	
	private final Collection<ProgramListener> programListeners = new LinkedList<>();
	private final JPanel panel = new JPanel();
	private final JComboBox<Program> programSelector = new JComboBox<>();
	private final JComboBox<Boolean> onPatternSelector = new JComboBox<>(new Boolean[]{true, false});
	private final MultiSelector<Course> coursesSelector = new MultiSelector<>();
	
	public MainView(){
		panel.setLayout(new GridLayout(4, 2));
		
		panel.add(new JLabel("Select Your program"));
		panel.add(programSelector);
		
		panel.add(new JLabel("Are you on-pattern?"));
		panel.add(onPatternSelector);
		
		panel.add(new JLabel("What Courses have you taken?"));
		panel.add(coursesSelector.getComponent());
		
		JButton submitButton = new JButton("Build Timetable");
		panel.add(submitButton);
		
		// Add Listeners
		ComponentListener l = new ComponentListener();
		programSelector.addItemListener(l);
		onPatternSelector.addItemListener(l);
		submitButton.addActionListener(l);
	}
	
	public void addProgramListener(ProgramListener l){
		programListeners.add(l);
	}

	@Override
	public JComponent getComponent() {
		return panel;
	}

	@Override
	public void updatePrograms(List<Program> programs) {
		programSelector.removeAllItems();
		for (Program program : programs){
			programSelector.addItem(program);
		}
	}

	@Override
	public void updateCourses(List<Course> courses) {	
		coursesSelector.updateItems(courses);
	}

	@Override
	public void selectProgram(Program program, boolean onPattern) {
		programSelector.setSelectedItem(program);
		onPatternSelector.setSelectedItem(onPattern);
	}
	
	private class ComponentListener implements ItemListener, ActionListener {
		
		private Program getProgram(){
			return (Program) programSelector.getSelectedItem();
		}
		
		private boolean onPattern(){
			return (Boolean) onPatternSelector.getSelectedItem();
		}

		@Override
		public void itemStateChanged(ItemEvent arg0) {
			Program program = getProgram();
			Boolean onPattern = onPattern();
			
			if (program != null && onPattern != null){
				for (ProgramListener l : programListeners){
					l.selectProgram(program, onPattern);
				}
			}
		}

		@Override
		public void actionPerformed(ActionEvent arg0) {
			Program program = getProgram();
			Boolean onPattern = onPattern();
			List<Course> coursesTaken = coursesSelector.getSelectedItems();
			
			if (program != null && onPattern != null && coursesTaken != null){
				StringBuilder message = new StringBuilder();
				message.append("Data Gathered:\n\n");
				message.append("Program: ").append(program).append("\n");
				message.append("On Pattern: ").append(onPattern).append("\n");
				message.append("\n");
				message.append("Courses Taken:\n");
				message.append("\n");
				for (Course course : coursesTaken){
					message.append(course).append("\n");
				}
				
				JOptionPane.showMessageDialog(null, message.toString());
			}
			
		}
	}
}
