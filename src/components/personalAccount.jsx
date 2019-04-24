import React from 'react';
import PersAccRequest from "./organisms/persAccRequest.jsx";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import "style/personalAccount.scss"

class PersonalAccount extends React.Component {
state={schet:"", upper:false} 
    
AddSymbol=(symbol)=>{
const sym=(this.state.upper? symbol.toUpperCase(): symbol.toLowerCase());
this.setState({schet: this.state.schet+sym});
}

RemoveSymbol=()=>{
    const schet=(this.state.schet.slice(0,this.state.schet.length-1));
    this.setState({schet});
}
    
UpperSymbol=()=>{
   this.setState({upper: !this.state.upper});
}

    render() {
      if (this.props.PersAcc.length===1) {
        return <Redirect to={`/personalAccount/${this.props.PersAcc[0].personalAccount}`} />
    } else {
        return (<div className="personalAccount">
            <h1 className="headline">Введите номер лицевого счета</h1>
            <div className="result">{this.state.schet}</div>
          
          <div className="virtual-keyboard">
            <div className="row">
              <input type="button" value="1" onClick={()=>this.AddSymbol("1")} />
              <input type="button" value="2" onClick={()=>this.AddSymbol("2")} />
              <input type="button" value="3" onClick={()=>this.AddSymbol("3")} />
              <input type="button" value="4" onClick={()=>this.AddSymbol("4")} />
              <input type="button" value="5" onClick={()=>this.AddSymbol("5")} />
              <input type="button" value="6" onClick={()=>this.AddSymbol("6")} />
              <input type="button" value="7" onClick={()=>this.AddSymbol("7")} />
              <input type="button" value="8" onClick={()=>this.AddSymbol("8")} />
              <input type="button" value="9" onClick={()=>this.AddSymbol("9")} />
              <input type="button" value="0" onClick={()=>this.AddSymbol("0")} />
              <input type="button" value="delete" onClick={()=>this.RemoveSymbol()}/>
            </div>
            <div className="row">
              <input type="button" value="q" onClick={()=>this.AddSymbol("q")} />
              <input type="button" value="w" onClick={()=>this.AddSymbol("w")} />
              <input type="button" value="e" onClick={()=>this.AddSymbol("e")} />
              <input type="button" value="r" onClick={()=>this.AddSymbol("r")} />
              <input type="button" value="t" onClick={()=>this.AddSymbol("t")} />
              <input type="button" value="y" onClick={()=>this.AddSymbol("y")} />
              <input type="button" value="u" onClick={()=>this.AddSymbol("u")} />
              <input type="button" value="i" onClick={()=>this.AddSymbol("i")} />
              <input type="button" value="o" onClick={()=>this.AddSymbol("o")} />
              <input type="button" value="p" onClick={()=>this.AddSymbol("p")} />
            </div>
            <div className="row">
              <input type="button" value="a" onClick={()=>this.AddSymbol("a")} />
              <input type="button" value="s" onClick={()=>this.AddSymbol("s")} />
              <input type="button" value="d" onClick={()=>this.AddSymbol("d")} />
              <input type="button" value="f" onClick={()=>this.AddSymbol("f")} />
              <input type="button" value="g" onClick={()=>this.AddSymbol("g")} />
              <input type="button" value="h" onClick={()=>this.AddSymbol("h")} />
              <input type="button" value="j" onClick={()=>this.AddSymbol("j")} />
              <input type="button" value="k" onClick={()=>this.AddSymbol("k")} />
              <input type="button" value="l" onClick={()=>this.AddSymbol("l")} />
            </div>
            <div className="row">
              <input type="button" value="z" onClick={()=>this.AddSymbol("z")} />
              <input type="button" value="x" onClick={()=>this.AddSymbol("x")} />
              <input type="button" value="c" onClick={()=>this.AddSymbol("c")} />
              <input type="button" value="v" onClick={()=>this.AddSymbol("v")} />
              <input type="button" value="b" onClick={()=>this.AddSymbol("b")} />
              <input type="button" value="n" onClick={()=>this.AddSymbol("n")} />
              <input type="button" value="m" onClick={()=>this.AddSymbol("m")} />
              <input type="button" value="CapsLock" onClick={()=>this.UpperSymbol()}/>
            </div>
            <div className="row spacebar">
              <input type="button" value=" " onClick={()=>this.AddSymbol(" ")} />
            </div>
          </div>
          <div className="submitButton"><PersAccRequest schet={this.state.schet}/></div>
          </div>)
        }
    }
}

    export default connect(state => ({ PersAcc: state.PersAcc }))(PersonalAccount);

