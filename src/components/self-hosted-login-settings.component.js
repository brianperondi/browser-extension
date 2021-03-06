import React from 'react';
import Request from 'react-http-request';
import Login from './login.component';
import {SettingsService} from "../services/settings-service";

const settingsService = new SettingsService();

class SelfHostedLoginSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            serverUrl: ""
        }
    }

    componentDidMount() {
        let url = this.props.url;
        if (this.props.url.charAt(this.props.url.length -1) === "/") {
            url = this.props.url.slice(0, this.props.url.length-1);
        }
        this.setState({
            serverUrl: url,
            ready: true
        });
    }

    render() {
        if (this.state.ready) {
            return (
                <Request
                    url={`${this.state.serverUrl}/api/system-settings/login-settings`}
                    method='get'
                    accept='application/json'
                    type="application/json"
                    verbose={true}>
                    {
                        ({error, result, loading}) => {
                            if (error) {
                                return <Login logout={true}/>;
                            }
                            if (loading) {
                                return (
                                    <div className="pull-loading">
                                        <img src="./assets/images/circle_1.svg"
                                             className="pull-loading-img1"/>
                                        <img src="./assets/images/circle_2.svg"
                                             className="pull-loading-img2"/>
                                    </div>
                                )
                            } else {
                                let url = this.props.url;
                                settingsService.setBaseUrl(url + '/api');
                                settingsService.setHomeUrl(
                                    url.replace('api.', '').replace('api', '')
                                );
                                settingsService.setSelfHosted(true);
    
                                return <Login loginSettings={JSON.parse(result.text)}/>
                            }
                        }
                    }
                </Request>
            );
        } else {
            return null;
        }
    }
}
export default SelfHostedLoginSettings;