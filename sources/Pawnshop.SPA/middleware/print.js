import ReactDOMServer from 'react-dom/server';
import { report } from '../actions/reports';

export const CALL_PRINT = Symbol('CALL_PRINT');
export const CALL_REPORT_HTML = Symbol('CALL_REPORT_HTML');
export const CALL_REPORT_EXCEL = Symbol('CALL_REPORT_EXCEL');

export default store => next => action => {
    const callPrint = action[CALL_PRINT];
    if (callPrint !== undefined) {
        let markup = ReactDOMServer.renderToStaticMarkup(callPrint.component);
        let wnd = window.open('about:blank');
        // TODO обрабатывать wnd = null (popup окна закблокированы), показывать уведомления
        wnd.document.open();
        wnd.document.write(markup);
        wnd.document.close();
        return;
    }

    const callReportHtml = action[CALL_REPORT_HTML];
    if (callReportHtml !== undefined) {
        store.dispatch(report(callReportHtml.query)).then(action => {
            if (action && action.data) {
                let report = new window.Stimulsoft.Report.StiReport();
                report.loadDocument(action.data);

                let settings = new window.Stimulsoft.Report.Export.StiHtmlExportSettings();
                settings.addPageBreaks = false;

                let html = report.exportDocument(window.Stimulsoft.Report.StiExportFormat.Html, null, settings);
                let wnd = window.open('about:blank');
                wnd.document.open();
                wnd.document.write(html);
                wnd.document.close();
                return;
            }
        });

        return;
    }

    const callReportExcel = action[CALL_REPORT_EXCEL];
    if (callReportExcel !== undefined) {
        store.dispatch(report(callReportExcel.query)).then(action => {
            if (action && action.data) {
                let report = new window.Stimulsoft.Report.StiReport();
                report.loadDocument(action.data);

                let excel = report.exportDocument(window.Stimulsoft.Report.StiExportFormat.Excel2007);
                Object.saveAs(excel, callReportExcel.query.reportName + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                return;
            }
        });

        return;
    }

    return next(action);
}