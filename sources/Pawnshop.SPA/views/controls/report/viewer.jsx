import React from 'react';
import { report } from '../../../actions/reports';

export default class ReportViewer extends React.Component {
    static propTypes = {
        reportName: React.PropTypes.string.isRequired,
        reportQuery: React.PropTypes.object.isRequired
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh(query) {
        if (!query) {
            query = {
                reportName: this.props.reportName,
                reportQuery: this.props.reportQuery    
            };
        }

        this.context.store.dispatch(report(query)).then(action => {
            if (action && action.data) {
                var options = new window.Stimulsoft.Viewer.StiViewerOptions();
                options.appearance.scrollbarsMode = true;
                options.height = '1000px';

                var viewer = new window.Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

                var report = new window.Stimulsoft.Report.StiReport();
                report.loadDocument(action.data);

                viewer.report = report;
                viewer.renderHtml('reportViewer');
            }
        });
    }

    render() {
        return <div id="reportViewer"></div>
    }
}