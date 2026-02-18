import axios from "axios";
import * as cheerio from 'cheerio';
import { Utils } from "../config/utils.js";

export class CatalogoCtl {
    static #headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
    };
    static getProductos = async (req, res) => {
        const { valor } = req.query;
        if (!valor) {
           return Utils.serverResponse({
                response: res,
                value: 400,
                msg: 'Falta el parámetro "valor"',
                value: false
            })
        }
        let paginaActual = 1;
        let resultados = [];
        let continuar = true;
        let ultimaPagina = null;
        try {
            while (continuar) {
                const url = `https://catalogoelectronico.compraspublicas.gob.ec/buscar?pag=${paginaActual}&valor=${encodeURIComponent(valor)}`;

                const { data } = await axios.get(url, { headers: this.#headers });
                const $ = cheerio.load(data);

                if (ultimaPagina === null) {
                    const enlaces = $('.pagination li a');
                    let maxPagina = 1;

                    enlaces.each((i, elem) => {
                        const texto = $(elem).text().trim();
                        const numero = parseInt(texto);
                        if (!isNaN(numero) && numero > maxPagina) {
                            maxPagina = numero;
                        }
                    });

                    ultimaPagina = maxPagina;
                    console.log(`Total de paginas ${ultimaPagina}`);
                }
                console.log(`pagina  ${paginaActual}`)

                const items = $('.crsl-item');

                if (items.length === 0) {
                    console.log('no hay mas productos');
                    continuar = false
                    break;
                }

                items.each((i, elemento) => {
                    const enlace = $(elemento).find('a');
                    const titulo = enlace.attr('title');

                    if (titulo) {
                        resultados.push({
                            nombre: titulo.trim()
                        });
                    }
                });

                if (paginaActual >= ultimaPagina) {
                    console.log(`Se obtuvieron todas las ${paginaActual} paginas`);
                    continuar = false;
                } else {
                    paginaActual++;
                }

                await new Promise(resolve => setTimeout(resolve, 300));
            }

            res.json({
                success: true,
                total: resultados.length,
                paginas: ultimaPagina,
                data: resultados
            });

        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({error: 'Error de conexión',detalle: error.message});
        }
    }
}

export default CatalogoCtl;