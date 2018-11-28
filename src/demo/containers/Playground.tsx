import React, { Component } from "react";
import logo from "../../images/logo.svg";
import "./App.css";
import * as SynapseConstants from "../../lib/utils/SynapseConstants";
import QueryWrapperMenu from 'src/lib/containers/QuerryWrapperMenu';
import { SynapseClient } from 'src/lib';
import StaticQueryWrapper from 'src/lib/containers/StaticQueryWrapper';
import SynapseTableCardView from 'src/lib/containers/SynapseTableCardView';

type DemoState = 
  {
    token: string
    ownerId: string
    isLoading: boolean
    showMarkdown: boolean
    version: number
    tabOne: any
    tabTwo: any
    showTabOne: boolean
  };
/**
 * Demo of features that can be used from src/demo/utils/SynapseClient
 * module
 */
class Demo extends Component<{}, DemoState> {
  /**
   * Maintain internal state of user session
   */
  constructor(props: any) {
    super(props);
    this.state = {
      token: "",
      version: 0,
      ownerId: "",
      isLoading: true,
      showMarkdown: true,
      tabOne:
        {
          menuConfig: [
            {
              sql: "SELECT * FROM syn9886254",
              synapseId: "syn9886254",
              facetName: "Organism",
              unitDescription: "data types",
              visibleColumnCount: 3,
              title: "my title"
            },
            { sql: "SELECT * FROM syn9886254",
              synapseId: "syn9886254",
              facetName: "Study",
              unitDescription: "files"
            }
          ]
          ,
          rgbIndex: 4,
          type: SynapseConstants.AMP_STUDY 
        }
      ,
      tabTwo:{
          menuConfig: [
            { sql: "SELECT * FROM syn17024229",
                synapseId: "syn17024229",
                facetName: "Program",
                unitDescription: "Program",
                title: "my title"
            }]
          ,
          rgbIndex: 0,
          type: SynapseConstants.AMP_PROJECT
        }
      ,
      showTabOne: true
    };
    this.makeSampleQueryCall = this.makeSampleQueryCall.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
  }

  /**
   * Make a query on synapse
   */
  makeSampleQueryCall(): void {
    // Example table (view) query.
    // See https://docs.synapse.org/rest/POST/entity/id/table/query/async/start.html
    let QUERY = {
      entityId: "syn12335586",
      query: {
        sql: "SELECT * FROM syn12335586",
        includeEntityEtag: true,
        isConsistent: false,
        offset: 0,
        limit: 100
      },
      partMask:
        SynapseConstants.BUNDLE_MASK_QUERY_RESULTS |
        SynapseConstants.BUNDLE_MASK_QUERY_COLUMN_MODELS |
        SynapseConstants.BUNDLE_MASK_QUERY_SELECT_COLUMNS |
        SynapseConstants.BUNDLE_MASK_QUERY_FACETS
    };
    SynapseClient.getQueryTableResults(QUERY)
      .then((data: any) => console.log(data))
      .catch(function(error: any) {
        console.error(error);
      });
  }
  /**
   * Update internal state
   * @param {Object} updatedState new state to be updated by the component
   */
  handleChange(updatedState: {}): void {
    this.setState(updatedState);
  }

  removeHandler(): void {
    this.setState({ showMarkdown: !this.state.showMarkdown });
  }

  render(): JSX.Element {
    let token: string | undefined = "";
    let inDevEnv = false;
    if (process.env.NODE_ENV === "development") {
      token = process.env.REACT_APP_DEV_TOKEN;
      inDevEnv = true;
    } else {
      token = this.state.token
    }


    return (
      <div className="App">
        <div className="App-header text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h4 className="white-text">Playground of components under development </h4>
        </div>
        <p className="App-intro text-center">Synapse production version: {this.state.version}</p>

        <button role="button" className="btn btn-default" onClick={() => {this.setState({showTabOne: !this.state.showTabOne})}}>
          toggle tabs
        </button>
        
        <QueryWrapperMenu
          token={inDevEnv ? token! : this.state.token!}
          menuConfig={this.state.showTabOne ? this.state.tabOne.menuConfig: this.state.tabTwo.menuConfig}
          rgbIndex={this.state.showTabOne ? this.state.tabOne.rgbIndex: this.state.tabTwo.rgbIndex}
          loadingScreen={<div>loading... </div>}
        />

        <StaticQueryWrapper token={token} sql={this.state.showTabOne? this.state.tabOne.menuConfig[0].sql: this.state.tabTwo.menuConfig[0].sql }>
          <SynapseTableCardView type={ this.state.showTabOne? SynapseConstants.AMP_STUDY: SynapseConstants.AMP_PROJECT}  />
        </StaticQueryWrapper>

        <StaticQueryWrapper token={token} sql={"SELECT * FROM syn17024229"}>
          <SynapseTableCardView type={SynapseConstants.AMP_PROJECT} />
        </StaticQueryWrapper>

        <StaticQueryWrapper token={token} sql={"SELECT * FROM syn17024173"}>
          <SynapseTableCardView type={SynapseConstants.AMP_CONSORTIUM} />
        </StaticQueryWrapper>

      </div>
    );
  }
}
export default Demo;