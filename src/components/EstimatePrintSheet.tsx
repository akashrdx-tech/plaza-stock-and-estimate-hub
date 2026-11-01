import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { formatQty, lineAmount, type BillLine, type BillMeta } from "@/lib/estimate-store";
import { formatPKR } from "@/lib/stock-types";

type Props = {
  meta: BillMeta;
  lines: BillLine[];
  subtotal: number;
  discount: number;
  discountLabel: string;
  total: number;
  received: number;
  balance: number;
};

/**
 * B5 printable estimate. Rendered straight into <body> so that, when printing,
 * every other body child (site chrome, floating buttons, hosting badges) can be hidden.
 * Outer table thead/tfoot act as repeating top/bottom page margins, which lets
 * @page use margin 0 (removes the browser's own URL/date header and footer).
 */
export function EstimatePrintSheet(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<Sheet {...props} />, document.body);
}

function Sheet({ meta, lines, subtotal, discount, discountLabel, total, received, balance }: Props) {
  const totalQty = lines.reduce((sum, line) => sum + (Number(line.qty) || 0), 0);

  return (
    <div className="print-sheet" aria-hidden="true">
      <table className="ps-frame">
        <thead>
          <tr>
            <td className="ps-gap-top" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td className="ps-gap-bottom" />
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td>
              <header className="ps-head">
                <div className="ps-brand">
                  <img src="/logo-plaza.png" alt="" className="ps-logo" />
                  <div>
                    <p className="ps-shop">PLAZA STEEL &amp; CROCKERY</p>
                    <p className="ps-shop-sub">WhatsApp: +92 546501637</p>
                  </div>
                </div>
                <div className="ps-doc">
                  <p className="ps-doc-title">ESTIMATE</p>
                  <table className="ps-doc-meta">
                    <tbody>
                      <tr>
                        <th>Bill No</th>
                        <td>{meta.billNo || "—"}</td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{meta.date || "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </header>

              <section className="ps-customer">
                <p className="ps-label">Customer / Bill To</p>
                <p className="ps-customer-name">{meta.customerName || "________________________"}</p>
                <div className="ps-customer-info">
                  <span>
                    <b>Number:</b> {meta.customerPhone || "—"}
                  </span>
                  {meta.customerAddress ? (
                    <span>
                      <b>Address:</b> {meta.customerAddress}
                    </span>
                  ) : null}
                </div>
              </section>

              <table className="ps-items">
                <thead>
                  <tr>
                    <th className="c-no">#</th>
                    <th className="c-item">Item Description</th>
                    <th className="c-qty">Qty</th>
                    <th className="c-rate">Rate</th>
                    <th className="c-amt">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={line.id}>
                      <td className="c-no">{index + 1}</td>
                      <td className="c-item">
                        {line.name}
                        {line.code ? <span className="ps-code"> ({line.code})</span> : null}
                      </td>
                      <td className="c-qty">
                        {formatQty(line.qty)}
                        {line.unit ? <span className="ps-unit"> {line.unit}</span> : null}
                      </td>
                      <td className="c-rate">{formatPKR(line.unitPrice)}</td>
                      <td className="c-amt">{formatPKR(lineAmount(line.qty, line.unitPrice))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ps-bottom">
                <div className="ps-left">
                  <p>
                    <b>Total items:</b> {lines.length} &nbsp;·&nbsp; <b>Total qty:</b>{" "}
                    {formatQty(totalQty)}
                  </p>
                  {meta.notes ? (
                    <p className="ps-notes">
                      <b>Note:</b> {meta.notes}
                    </p>
                  ) : null}
                </div>
                <table className="ps-totals">
                  <tbody>
                    <tr>
                      <th>Subtotal</th>
                      <td>Rs {formatPKR(subtotal)}</td>
                    </tr>
                    {discount > 0 ? (
                      <tr>
                        <th>{discountLabel}</th>
                        <td>- Rs {formatPKR(discount)}</td>
                      </tr>
                    ) : null}
                    <tr className="ps-grand">
                      <th>TOTAL</th>
                      <td>Rs {formatPKR(total)}</td>
                    </tr>
                    {received > 0 ? (
                      <>
                        <tr>
                          <th>Received</th>
                          <td>Rs {formatPKR(received)}</td>
                        </tr>
                        <tr className="ps-balance">
                          <th>Balance</th>
                          <td>Rs {formatPKR(balance)}</td>
                        </tr>
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="ps-sign">
                <div>
                  <span />
                  Customer Signature
                </div>
                <div>
                  <span />
                  For Plaza Steel &amp; Crockery
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
