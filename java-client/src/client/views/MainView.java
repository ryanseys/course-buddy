package client.views;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

import client.listeners.CourseListener;
import client.listeners.ProgramListener;
import client.listeners.SubmitListener;
import client.listeners.YesNoListener;
import client.models.Course;
import client.models.Program;

/**
 * Main View for the Application.
 * 
 * Holds all of the components for the main views and contains an intermediary
 * listener for interpreting GUI events and converting them to more concrete
 * events to the listening controllers.
 * 
 * For example, if the user selects a program, then the intermediary listener
 * will inform the ProgramListener that the program has changed.
 * 
 * @author Andrew O'Hara
 */
public class MainView implements ViewComponent, ProgramListener, CourseListener, YesNoListener {
	
	private final Collection<ProgramListener> programListeners = new LinkedList<>();
	private final Collection<SubmitListener> submitListeners = new LinkedList<>();
	private final Collection<CourseListener> courseListeners = new LinkedList<>();
	
	private final JPanel panel = new JPanel(), courseInputPanel = new JPanel();
	private final JComboBox<Program> programSelector = new JComboBox<>();
	private final YesNoPanel onPatternChooser = new YesNoPanel();
	private final MultiSelector<Course> coursesSelector = new MultiSelector<>();
	private final JComboBox<String> termSelector = new JComboBox<>();
	
	public MainView(){
		// Init Components
		panel.setLayout(new BorderLayout());
		
		JPanel programPanel = new JPanel();
		programPanel.setBorder(BorderFactory.createRaisedBevelBorder());
		programPanel.add(new JLabel("Select Your program"));
		programPanel.add(programSelector);
		panel.add(programPanel, BorderLayout.NORTH);
		
		JPanel courseQuestionPanel = new JPanel();
		courseQuestionPanel.add(new JLabel("Are you on-pattern?"));
		courseQuestionPanel.add(onPatternChooser.getComponent());
		
		JPanel coursePanel = new JPanel(new BorderLayout());
		coursePanel.add(courseQuestionPanel, BorderLayout.NORTH);
		coursePanel.add(courseInputPanel, BorderLayout.CENTER);
		panel.add(coursePanel, BorderLayout.CENTER);
		
		JButton submitButton = new JButton("Build Timetable");
		panel.add(submitButton, BorderLayout.SOUTH);
		
		// Setup Term Selector
		termSelector.addItem(null);
		termSelector.addItem("Fall - 1st Year");
		termSelector.addItem("Winter - 1st Year");
		termSelector.addItem("Fall - 2nd Year");
		termSelector.addItem("Winter - 2nd Year");
		termSelector.addItem("Fall - 3rd Year");
		termSelector.addItem("Winter - 3rd Year");
		termSelector.addItem("Fall - 4th Year");
		termSelector.addItem("Winter - 4th Year");
		
		// Add Listeners
		ComponentListener l = new ComponentListener();
		programSelector.addItemListener(l);
		coursesSelector.addListSelectionListener(l);
		termSelector.addItemListener(l);
		onPatternChooser.addYesNoListener(this);
		submitButton.addActionListener(l);
	}
	
	// GUI Methods
	
	@Override
	public JComponent getComponent() {
		return panel;
	}
	
	// Add Listeners
	
	public void addProgramListener(ProgramListener l){
		programListeners.add(l);
	}
	
	public void addCourseListener(CourseListener l){
		courseListeners.add(l);
	}
	
	public void addYesNoListener(YesNoListener l){
		onPatternChooser.addYesNoListener(l);
	}
	
	public void addSubmitListener(SubmitListener l){
		submitListeners.add(l);
	}
	
	// Listeners

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
	public void selectProgram(Program program) {
		programSelector.setSelectedItem(program);
	}
	
	@Override
	public void yesNoSelection(boolean value) {
		onPatternChooser.setValue(value);
		
		// React to Yes/No Value selection, and update GUI with appropriate inputs
		courseInputPanel.removeAll();
		if (value){
			courseInputPanel.add(new JLabel("What term would you like to generate a timetbale for?"));
			courseInputPanel.add(termSelector);
		} else {
			courseInputPanel.add(new JLabel("What Courses have you taken?"));
			courseInputPanel.add(coursesSelector.getComponent());
		}
		panel.revalidate();
		panel.repaint();
	}
	
	@Override
	public void selectOnPatternTerm(String term) {
		termSelector.setSelectedItem(term);
	}
	
	// Nested Listener Class
	
	private class ComponentListener implements ItemListener, ActionListener, ListSelectionListener {

		@Override
		public void itemStateChanged(ItemEvent arg0) {
			Program program = (Program) programSelector.getSelectedItem();
			String term = (String) termSelector.getSelectedItem();
			if (program != null){
				for (ProgramListener l : programListeners){
					l.selectProgram(program);
				}
			}
			if (term != null){
				for (CourseListener l : courseListeners){
					l.selectOnPatternTerm(term);
				}
			}			
		}

		@Override
		public void actionPerformed(ActionEvent arg0) {
			for (SubmitListener l : submitListeners){
				l.submit();
			}
		}

		@Override
		public void valueChanged(ListSelectionEvent e) {
			for (CourseListener l : courseListeners){
				l.updateCourses(coursesSelector.getSelectedItems());
			}
		}
	}
}
