package client;

import javax.swing.JFrame;

import client.controllers.MainViewController;
import client.models.Constants;
import client.views.MainView;

public class Client {
	
	public static void main(String[] args){
		// Setup views
		MainView mainView = new MainView();
		
		// setup frame
		JFrame frame = new JFrame(Constants.APP_NAME);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.add(mainView.getComponent());
		frame.setSize(350, 400);
		
		// setup controllers
		MainViewController mainViewController = new MainViewController();
		mainViewController.addProgramListener(mainView);
		mainViewController.addCourseListener(mainView);
		mainView.addProgramListener(mainViewController);
		mainView.addYesNoListener(mainViewController);
		mainView.addCourseListener(mainViewController);
		mainView.addSubmitListener(mainViewController);
		mainViewController.refresh();
		
		// start
		frame.setVisible(true);
	}

}
