from flask_restful import Resource, reqparse
from flask import jsonify, current_app, request, make_response
from ..utils import *
from ..schemas.ibov_schemas import *

class BootstrapResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('stocks', type=str, required=True, help='Comma-separated list of stock symbols')
        parser.add_argument('period', type=int, required=True, help='Analysis period in months')
        parser.add_argument('iterations', type=int, required=True, help='Number of Monte Carlo iterations')
        parser.add_argument('time_steps', type=int, required=True, help='Number of time steps in each simulation')
        args = parser.parse_args()

        try:
            results = run_bootstrap(args['stocks'], args['period'], args['iterations'], args['time_steps'])
            return make_response(jsonify(results), 200)
        except Exception as e:
            current_app.logger.error(f"Error in BootstrapResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)
class OptimizationResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('stocks', type=str, required=True, help='Comma-separated list of stock symbols')
        parser.add_argument('period', type=int, required=True, help='Optimization period in months')
        args = parser.parse_args()

        try:
            results = run_optimization(args['stocks'], args['period'])
            return make_response(jsonify(results), 200)
        except Exception as e:
            current_app.logger.error(f"Error in OptimizationResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class SurfaceAnalysisResource(Resource):
    def get(self):
        try:
            ticker = request.args.get('ticker')
            surface_data = get_surface_analysis(ticker)
            
            return make_response(jsonify(surface_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in SurfaceAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)
class FundamentalSummaryAnalysisResource(Resource):
    def get(self):
        try:
            fundamental_data = get_fundamentalsummary_analysis()
            
            # Get query parameters
            ticker = request.args.get('ticker')
            field = request.args.get('field')
            
            # Filter data based on query parameters
            if ticker and ticker in fundamental_data:
                fundamental_data = {ticker: fundamental_data[ticker]}
            
            if field:
                for t in fundamental_data:
                    if field in fundamental_data[t]:
                        fundamental_data[t] = {field: fundamental_data[t][field]}
                    else:
                        fundamental_data[t] = {}
            
            return make_response(jsonify(fundamental_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in FundamentalSummaryAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class StatementsAnalysisResource(Resource):
    def get(self):
        try:
            statements_data = get_statements_analysis()
            
            # Get query parameters
            ticker = request.args.get('ticker')
            
            # Filter data based on query parameters
            if ticker and ticker in statements_data:
                statements_data = {ticker: statements_data[ticker]}            
            return make_response(jsonify(statements_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in StatementsAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class HistoricalDYAnalysisResource(Resource):
    def get(self):
        try:
            historical_dy_data = get_historicaldy_analysis()
            
            # Get query parameters
            ticker = request.args.get('ticker')
            
            # Filter data based on query parameters
            if ticker and ticker in historical_dy_data:
                historical_dy_data = {ticker: historical_dy_data[ticker]}
            
            return make_response(jsonify(historical_dy_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in HistoricalDYAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class DividendAgendaAnalysisResource(Resource):
    def get(self):
        try:
            dividend_data = get_dividend_agenda_analysis()
            
            # Get query parameters
            ticker = request.args.get('ticker')
            
            # Filter data based on query parameters
            if ticker:
                dividend_data = [item for item in dividend_data if item['Acao'] == ticker]
            
            return make_response(jsonify(dividend_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in DividendAgendaAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class SurvivalLomaxAnalysisResource(Resource):
    def get(self):
        try:
            survival_data = get_survival_lomax_analysis()
            
            # Get query parameters
            ticker = request.args.get('ticker')
            threshold = request.args.get('threshold')
            
            # Filter data based on query parameters
            if ticker and ticker in survival_data:
                survival_data = {ticker: survival_data[ticker]}
            
            if threshold:
                for t in survival_data:
                    if threshold in survival_data[t]:
                        survival_data[t] = {threshold: survival_data[t][threshold]}
                    else:
                        survival_data[t] = {}
            
            return make_response(jsonify(survival_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in SurvivalLomaxAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class ScreenerAnalysisResource(Resource):
    def get(self):
        try:
            screener_data = get_screener_analysis()
            
            # Get query parameters
            table = request.args.get('table')
            condition = request.args.get('condition')
            
            # Filter data based on query parameters
            if table and table in screener_data:
                screener_data = {table: screener_data[table]}
            
            if condition in ['overbought', 'oversold']:
                for t in screener_data:
                    screener_data[t] = {condition: screener_data[t][condition]}
            
            current_app.logger.info(f"Filtered screener data: {screener_data}")
            return make_response(jsonify(screener_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in ScreenerAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class RecommendationsNYSEAnalysisResource(Resource):
    def get(self):
        try:
            recommendations_data = get_nyse_recommendations_analysis()
            
            # Get query parameter
            analysis_type = request.args.get('analysis', 'all')
            
            if analysis_type == 'strong_buy':
                result = analyze_strongbuy(recommendations_data)
            elif analysis_type == 'buy':
                result = analyze_buy(recommendations_data)
            else:
                result = recommendations_data
            
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in RecommendationsAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500)

class RecommendationsNASDAQAnalysisResource(Resource):
    def get(self):
        try:
            recommendations_data = get_nasdaq_recommendations_analysis()
            
            # Get query parameter
            analysis_type = request.args.get('analysis', 'all')
            
            if analysis_type == 'strong_buy':
                result = analyze_strongbuy(recommendations_data)
            elif analysis_type == 'buy':
                result = analyze_buy(recommendations_data)
            else:
                result = recommendations_data
            
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in RecommendationsAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500)

class RecommendationsAnalysisResource(Resource):
    def get(self):
        try:
            recommendations_data = get_recommendations_analysis()
            
            # Get query parameter
            analysis_type = request.args.get('analysis', 'all')
            
            if analysis_type == 'strong_buy':
                result = analyze_strongbuy(recommendations_data)
            elif analysis_type == 'buy':
                result = analyze_buy(recommendations_data)
            else:
                result = recommendations_data
            
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in RecommendationsAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500)

class InvertedCollarAnalysisResource(Resource):
    def get(self):
        try:
            inverted = request.args.get('inverted', 'false').lower() == 'true'
            collar_data = get_inverted_collar_analysis(inverted)
            
            # Get query parameters
            category = request.args.get('category')
            maturity_range = request.args.get('maturity_range')
            
            # Filter data based on query parameters
            if category and category in collar_data:
                collar_data = {category: collar_data[category]}
            
            if maturity_range:
                for cat in collar_data:
                    if maturity_range in collar_data[cat]:
                        collar_data[cat] = {maturity_range: collar_data[cat][maturity_range]}
                    else:
                        collar_data[cat] = {}
            
            return make_response(jsonify(collar_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in CollarAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class CollarAnalysisResource(Resource):
    def get(self):
        try:
            collar_data = get_collar_analysis()
            
            # Get query parameters
            category = request.args.get('category')
            maturity_range = request.args.get('maturity_range')
            
            # Filter data based on query parameters
            if category and category in collar_data:
                collar_data = {category: collar_data[category]}
            
            if maturity_range:
                for cat in collar_data:
                    if maturity_range in collar_data[cat]:
                        collar_data[cat] = {maturity_range: collar_data[cat][maturity_range]}
                    else:
                        collar_data[cat] = {}
            
            return make_response(jsonify(collar_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in CollarAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class QuantPortResource(Resource):
    def get(self):
        try:
            quant_port_data = get_quant_port_data()
            return make_response(jsonify(quant_port_data), 200)
        except Exception as e:
            current_app.logger.error(f"Error in QuantPortResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)


class CointegrationResource(Resource):
    def get(self):
        cointegration_data = get_cointegration_data()
        return make_response(jsonify(cointegration_data), 200)

class CurrencyCointegrationResource(Resource):
    def get(self):
        cointegration_data = get_currency_cointegration_data()
        return make_response(jsonify(cointegration_data), 200)

class FluxoDDMResource(Resource):
    def get(self):
        try:
            fluxo_ddm_data = get_fluxo_ddm_data()
            print(f"Fluxo DDM data retrieved: {fluxo_ddm_data}")
            
            # Get query parameters
            symbol = request.args.get('symbol')
            
            # Filter by symbol if provided
            if symbol and symbol in fluxo_ddm_data:
                fluxo_ddm_data = {symbol: fluxo_ddm_data[symbol]}
            
            schema = FluxoDDMSchema()
            result = schema.dump(fluxo_ddm_data)
            print(f"Result after schema dump: {result}")
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in FluxoDDMResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class RRGDataResource(Resource):
    def get(self):
        try:
            rrg_data = get_rrg_data()
            print(f"RRG data retrieved: {rrg_data}")
            
            # Get query parameters
            symbol = request.args.get('symbol')
            
            # Filter by symbol if provided
            if symbol and symbol in rrg_data:
                rrg_data = {symbol: rrg_data[symbol]}
            
            schema = RRGDataSchema()
            result = schema.dump(rrg_data)
            print(f"Result after schema dump: {result}")
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in RRGDataResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)
            
class CumulativePerformanceResource(Resource):
    def get(self):
        try:
            performance_data = get_cumulative_performance()
            
            # Get query parameters
            asset = request.args.get('asset')
            
            # Filter by asset if provided
            if asset and asset in performance_data:
                performance_data = {asset: performance_data[asset]}
            
            schema = CumulativePerformanceSchema()
            result = schema.dump(performance_data)
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in CumulativePerformanceResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class IBOVSTATICResource(Resource):
    def get(self):
        try:
            stocks = getstatic_ibov_stocks()
            
            # Get query parameters
            symbol = request.args.get('symbol')
            limit = request.args.get('limit', type=int)
            
            # Filter by symbol if provided
            if symbol:
                stocks = [stock for stock in stocks if stock['symbol'] == symbol]
            
            # Limit the number of results if specified
            if limit and limit > 0:
                stocks = stocks[:limit]
            
            schema = IBOVSchema(many=True)
            result = schema.dump(stocks)
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in IBOVSTATICResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

class IBOVResource(Resource):
    def get(self):
        try:
            data = get_ibov_stocks()
            schema = IBOVSchema(many=True)
            result = schema.dump(data)
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in IBOVResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)


class VolatilityAnalysisResource(Resource):
    def get(self):
        try:
            stocks = get_volatility_analysis()
            
            # Get query parameters
            symbol = request.args.get('symbol')
            limit = request.args.get('limit', type=int)
            
            # Filter by symbol if provided
            if symbol:
                stocks = [stock for stock in stocks if stock['symbol'] == symbol]
            
            # Limit the number of results if specified
            if limit and limit > 0:
                stocks = stocks[:limit]
            
            schema = VolatilityAnalysisSchema(many=True)
            result = schema.dump(stocks)
            return make_response(jsonify(result), 200)
        except Exception as e:
            current_app.logger.error(f"Error in VolatilityAnalysisResource: {str(e)}")
            return make_response(jsonify({'error': 'Internal Server Error'}), 500)

def index():
    return make_response(jsonify({
        "message": "Welcome to the IBOV API",
        "endpoints": [
            "/api/ibov",
            "/api/ibovstatic",
            "/api/ibovstatic?symbol=PETR4",
            "/api/ibovstatic?limit=10",
            "/api/volatility",
            "/api/performance",
            "/api/performance?asset=CDI",
            "/api/rrg",
            "/api/fluxo",
            "/api/cointegration",
            "/api/currency_cointegration",
            "/api/quant_port",
            "/api/collar_analysis",
            "/api/inverted_collar_analysis",
            '/api/recommendations',
            '/api/nasdaq_recommendations',
            '/api/nyse_recommendations',
            '/api/recommendations?analysis=strong_buy',
            '/api/recommendations?analysis=buy',
            '/api/nasdaq_recommendations?analysis=strong_buy',
            '/api/nasdaq_recommendations?analysis=buy',
            '/api/nyse_recommendations?analysis=strong_buy',
            '/api/nyse_recommendations?analysis=buy',
            '/api/screener',
            '/api/survival_lomax',
            '/api/dividend_agenda',
            '/api/historical_dy',
            '/api/statements',
            '/api/fundamental_summary',
            '/api/surface',
            '/api/surface?ticker=PETR4',
        ]
    }), 200)