package client.views;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.util.Collection;
import java.util.LinkedList;

import javax.swing.AbstractAction;
import javax.swing.ButtonGroup;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.JRadioButton;

import client.listeners.YesNoListener;

public class YesNoPanel implements ViewComponent {
	
	private JPanel panel = new JPanel();
	private final Collection<YesNoListener> listeners = new LinkedList<>();
	private final JRadioButton yes, no;
	
	public YesNoPanel(){
		panel.setLayout(new FlowLayout(FlowLayout.CENTER));
		
		yes = new JRadioButton(new YesNoAction(true));
		no = new JRadioButton(new YesNoAction(false));
		
		ButtonGroup group = new ButtonGroup();
		group.add(yes);
		group.add(no);
		
		panel.add(yes);
		panel.add(no);
	}

	@Override
	public JComponent getComponent() {
		return panel;
	}
	
	public void setValue(boolean value){
		yes.setSelected(value);
		no.setSelected(!value);
	}
	
	public boolean hasValue(){
		return yes.isSelected() || no.isSelected();
	}
	
	public boolean getValue(){
		if (!hasValue()){
			throw new IllegalStateException("No value is selected");
		}
		return yes.isSelected();
	}
	
	public void addYesNoListener(YesNoListener l){
		listeners.add(l);
	}
	
	@SuppressWarnings("serial")
	private class YesNoAction extends AbstractAction{
		
		public final boolean value;
		
		public YesNoAction(boolean value){
			super(value ? "Yes" : "No");
			this.value = value;
		}

		@Override
		public void actionPerformed(ActionEvent arg0) {
			for (YesNoListener l : listeners){
				l.yesNoSelection(value);
			}
		}
		
	}

}
