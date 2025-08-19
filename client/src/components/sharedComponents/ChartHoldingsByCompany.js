import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import treemap from 'highcharts/modules/treemap';
import './ChartHoldingByCompany.css';

// Initialize the treemap module
treemap(Highcharts);

const ChartHoldingsByCompany = ({sharesData}) => {
    
    const treemapData = sharesData.map((company) => {
        const totalValue = company.currentPrice * company.numberOfShares;
        const totalPaid = company.avgPurchasePrice * company.numberOfShares;
        const profitLoss = totalValue - totalPaid;

        return {
            name: `${company.name} (${company.symbol})`,
            value: totalValue,
            // --- FIX: Set the color of the box directly ---
            color: profitLoss >= 0 ? 'rgba(51, 255, 87, 0.7)' : 'rgba(255, 87, 51, 0.7)',
            // We still need colorValue for the tooltip and formatter logic
            colorValue: profitLoss 
        };
    });
    
    const options = {
        chart: {
            type: 'treemap'
        },
        // --- The colorAxis is no longer needed as color is set per point ---
        title: {
            text: 'Portfolio Distribution by Company'
        },
        tooltip: {
            pointFormat: '<b>{point.name}</b>:<br>Value: $ {point.value:,.2f}<br>P/L: $ {point.colorValue:,.2f}'
        },
        series:[{
            layoutAlgorithm: 'squarified',
            data: treemapData,
            dataLabels: {
                enabled: true,
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textOutline: 'none',
                    color: '#333' // Keep text dark for readability against colored backgrounds
                },
                formatter: function () {
                    const point = this.point;
                    const totalPaid = point.value - point.colorValue;
                    const percentage = totalPaid !== 0 ? (point.colorValue / totalPaid) * 100 : 0;
                    const sign = point.colorValue >= 0 ? '+' : '';
                    
                    const symbol = point.name.substring(point.name.lastIndexOf("(") + 1, point.name.lastIndexOf(")"));
                    
                    // The text itself no longer needs to be colored
                    return `
                        ${symbol}<br/>
                        <span style="font-size: 12px;">
                            P/L: ${sign}$${point.colorValue.toFixed(2)} (${sign}${percentage.toFixed(2)}%)
                        </span>
                    `;
                }
            }
        }],
        credits: {
            enabled: false
        }
    };
    
    return (
        <div className='chart-container'>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default ChartHoldingsByCompany;
