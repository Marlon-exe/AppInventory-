import axios from "axios";
import * as cheerio from 'cheerio';
import { Utils } from "../config/utils.js";

export class CatalogoCtl {

    static #URL_RUTA = 'https://catalogoelectronico.compraspublicas.gob.ec';
    static #headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    static getProductos = async (req, res) => {
        const { valor } = req.query;
        if (!valor) {
            return Utils.serverResponse({
                response: res,
                code: 400,
                msg: 'Falta el parámetro "la busqueda"',
                value: false
            })
        }

        try {
            const urlBase = `${this.#URL_RUTA}/buscar?valor=${encodeURIComponent(valor)}`;
            const { data: htmlInicial } = await axios.get(`${urlBase}&pag=1`, { headers: this.#headers });

            const raquoMatch = htmlInicial.match(/href="[^"]*pag=(\d+)[^"]*"[^>]*>(?:&raquo;|»)<\/a>/);
            const totalPaginas = raquoMatch ? parseInt(raquoMatch[1]) : 1;

            console.log(`Buscando: ${valor} | Total de páginas detectadas: ${totalPaginas}`);

            let resultados = [];

            for (let i = 1; i <= totalPaginas; i++) {
                console.log(`Procesando página ${i} de ${totalPaginas}...`);

                const { data } = await axios.get(`${urlBase}&pag=${i}`, { headers: this.#headers });
                const $ = cheerio.load(data);
                const items = $('.crsl-item');

                if (items.length === 0) break;

                items.each((_, elemento) => {
                    const ruta = $(elemento).find('a[title]')
                    const titulo = ruta.attr('title')?.trim();
                    const urlProducto = ruta.attr('href')
                    if (titulo) {
                        resultados.push({
                            nombre: titulo,
                            url: urlProducto ? `https://catalogoelectronico.compraspublicas.gob.ec${urlProducto}` : null
                        });
                    }
                });

                if (totalPaginas > 1) await new Promise(r => setTimeout(r, 200));
            }

            return Utils.serverResponse({
                response: res,
                code: 200,
                msg: 'Buqueda exitosa',
                value: true,
                data: {
                    totalItems: resultados.length,
                    totalPaginas: totalPaginas,
                    productos: resultados
                }
            })

        } catch (error) {
            console.error('Scraping Error:', error.message);

            return Utils.serverResponse({
                response: res,
                code: 500,
                msg: 'Error interno en el servidor de catálogo',
                value: false,
                error: error.message
            });
        }
    }

    static getDetalleProducto = async (req, res) => {
        try {
            const { url } = req.query;
            if (!url) {
                return Utils.serverResponse({
                    response: res,
                    code: 400,
                    msg: 'Falta de Url del producto',
                    value: false
                });
            }

            const rout = `${this.#URL_RUTA}${url}`;
            console.log('URL que se está consultando:', rout);
            const response = await axios.get(rout, { headers: this.#headers });
            const data = response.data;

            const $ = cheerio.load(data);
            const especificaciones = {};

            $('#especs-tab #tabla_fixed1 tbody tr').each((_, element) => {
                const celdas = $(element).find('td');

                if (celdas.length >= 2) {
                    const propiedad = $(celdas[0]).text().trim();
                    const valor = $(celdas[1]).text().trim();

                    if (propiedad) {
                        especificaciones[propiedad] = valor;
                    }
                }
            });

            return Utils.serverResponse({
                response: res,
                code: 200,
                message: 'Especificaciones extraidas',
                value: true,
                data: especificaciones
            })

        } catch (error) {
            return Utils.serverResponse({
                response: res,
                code: 500,
                msg: 'Error al extraer especificaciones',
                value: false,
                error: error.message
            });

        }
    }
}

export default CatalogoCtl;