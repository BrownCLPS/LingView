class TierCheckbox extends React.Component {
   // I/P: tier_name, a string like "English Morphemes"
   // O/P: a checkbox with the ability to hide/show elements with tier-data={tier_name}
   constructor(props) {
      super(props);
      this.state = {
         checkboxState: true
      };
      this.toggle = this.toggle.bind(this);
   }

   toggle(event) {
      this.setState({checkboxState: !this.state.checkboxState});

      if (this.state.checkboxState) {
         $("tr[data-tier='" + this.props.tier_name + "']").css('display', 'none');
      } else {
         $("tr[data-tier='" + this.props.tier_name + "']").css('display', 'table-row');
      }
   }

   render() {
      const tier_name = this.props.tier_name;
      return (
         <li>
            <input type="checkbox" onClick={this.toggle} defaultChecked />
            <label>{tier_name}</label>
         </li>
      );
   }
}

export function TierCheckboxList({ tiers }) {
   // I/P: tiers, a hashmap from tier names to whether the tier is subdivided
   // O/P: an unordered list of TierCheckboxes
   let output = [];
   for (const tier_name in tiers) {
      if (tiers.hasOwnProperty(tier_name)) {
         output.push(<TierCheckbox key={tier_name} tier_name={tier_name} />);
      }
   }
   return <div id="tierList"><b>Show/hide tiers:</b> <ul>{output}</ul></div>;
}