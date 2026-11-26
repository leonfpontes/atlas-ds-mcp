# Atlas evaluation

Same model, same 20 prompts, without the Atlas MCP server, with its four lookup tools only, and with all five (lookups plus `validate_screen`).

- Model: `claude-haiku-5-5` · n = 20 prompts × 3 runs per variant · numbers are mean ± standard deviation across runs
- Run: 2026-11-26T00:10:28.919Z · Atlas v0.1.0 · prompts 8a519b72
- Render test: the real Atlas components
- Total cost: $0.82 (limit $3.00)

| Metric                    | Without Atlas | Lookups only | Full server: first draft | Full server: final        |
| ------------------------- | ------------- | ------------ | ------------------------ | ------------------------- |
| Valid screens             | 23.3% ± 7.6%  | 98.3% ± 2.9% | 96.7% ± 2.9%             | 100% ± 0%                 |
| Render test passed        | 35% ± 0%      | 98.3% ± 2.9% | 98.3% ± 2.9%             | 100% ± 0%                 |
| Issues per screen         | 3.28 ± 0.67   | 0.02 ± 0.03  | 0.02 ± 0.03              | 0 ± 0                     |
| Tokens per screen         | 5122 ± 198    | 29791 ± 2865 | —                        | 58311 ± 4358              |
| Tool calls per screen     | 0             | 8.6          | —                        | 9.7 (1.3 validate_screen) |
| Cost per run (20 screens) | $0.0490       | $0.0907      | —                        | $0.13                     |

The first draft is the file the model sent to its first `validate_screen` call (or its final file when it never called it).

Issues by rule, all runs. Without: hard-coded-color 68, unknown-component 104, invalid-prop 25. Lookups only: unknown-component 1. Full server: none.

## Per screen

| Run | Case                  | Variant     | Valid | Rendered | Issues | First draft valid | Tool calls | Tokens | Cost    |
| --- | --------------------- | ----------- | ----- | -------- | ------ | ----------------- | ---------- | ------ | ------- |
| 1   | orders-table          | without-mcp | no    | yes      | 12     | —                 | 0          | 3691   | $0.0017 |
| 1   | orders-table          | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 23475  | $0.0037 |
| 1   | orders-table          | with-mcp    | yes   | yes      | 0      | yes               | 8          | 43278  | $0.0054 |
| 1   | product-form          | without-mcp | no    | no       | 2      | —                 | 0          | 4097   | $0.0019 |
| 1   | product-form          | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 31845  | $0.0042 |
| 1   | product-form          | with-mcp    | yes   | yes      | 0      | yes               | 9          | 66382  | $0.0072 |
| 1   | sales-dashboard       | without-mcp | no    | yes      | 6      | —                 | 0          | 5520   | $0.0026 |
| 1   | sales-dashboard       | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 26327  | $0.0052 |
| 1   | sales-dashboard       | with-mcp    | yes   | yes      | 0      | yes               | 8          | 60171  | $0.0066 |
| 1   | empty-orders          | without-mcp | yes   | yes      | 0      | —                 | 0          | 2347   | $0.0011 |
| 1   | empty-orders          | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 22004  | $0.0031 |
| 1   | empty-orders          | with-mcp    | yes   | yes      | 0      | yes               | 7          | 26032  | $0.0028 |
| 1   | checkout-error        | without-mcp | no    | no       | 2      | —                 | 0          | 5204   | $0.0025 |
| 1   | checkout-error        | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 29195  | $0.0062 |
| 1   | checkout-error        | with-mcp    | yes   | yes      | 0      | yes               | 9          | 57258  | $0.0068 |
| 1   | delete-product-dialog | without-mcp | no    | no       | 9      | —                 | 0          | 3462   | $0.0016 |
| 1   | delete-product-dialog | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 16731  | $0.0025 |
| 1   | delete-product-dialog | with-mcp    | yes   | yes      | 0      | yes               | 7          | 27823  | $0.0035 |
| 1   | inventory-low-stock   | without-mcp | no    | yes      | 1      | —                 | 0          | 4659   | $0.0022 |
| 1   | inventory-low-stock   | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 26562  | $0.0049 |
| 1   | inventory-low-stock   | with-mcp    | yes   | yes      | 0      | yes               | 11         | 59377  | $0.0066 |
| 1   | customer-profile      | without-mcp | no    | no       | 9      | —                 | 0          | 6483   | $0.0031 |
| 1   | customer-profile      | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 28648  | $0.0053 |
| 1   | customer-profile      | with-mcp    | yes   | yes      | 0      | yes               | 12         | 65128  | $0.0080 |
| 1   | delivery-slot-picker  | without-mcp | no    | no       | 1      | —                 | 0          | 4543   | $0.0022 |
| 1   | delivery-slot-picker  | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 25698  | $0.0047 |
| 1   | delivery-slot-picker  | with-mcp    | yes   | yes      | 0      | yes               | 11         | 67414  | $0.0077 |
| 1   | command-search        | without-mcp | yes   | yes      | 0      | —                 | 0          | 5134   | $0.0025 |
| 1   | command-search        | docs-mcp    | yes   | yes      | 0      | —                 | 4          | 15059  | $0.0031 |
| 1   | command-search        | with-mcp    | yes   | yes      | 0      | yes               | 7          | 53896  | $0.0070 |
| 1   | mobile-filters-sheet  | without-mcp | no    | no       | 8      | —                 | 0          | 6261   | $0.0030 |
| 1   | mobile-filters-sheet  | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 38278  | $0.0068 |
| 1   | mobile-filters-sheet  | with-mcp    | yes   | yes      | 0      | yes               | 12         | 74556  | $0.0089 |
| 1   | order-detail          | without-mcp | no    | no       | 1      | —                 | 0          | 5465   | $0.0026 |
| 1   | order-detail          | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 30246  | $0.0056 |
| 1   | order-detail          | with-mcp    | yes   | yes      | 0      | yes               | 9          | 57450  | $0.0069 |
| 1   | settings-store        | without-mcp | no    | no       | 2      | —                 | 0          | 5224   | $0.0025 |
| 1   | settings-store        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 36536  | $0.0057 |
| 1   | settings-store        | with-mcp    | yes   | yes      | 0      | yes               | 11         | 88136  | $0.0099 |
| 1   | loading-orders        | without-mcp | no    | no       | 1      | —                 | 0          | 4260   | $0.0020 |
| 1   | loading-orders        | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 20967  | $0.0032 |
| 1   | loading-orders        | with-mcp    | yes   | yes      | 0      | yes               | 9          | 53941  | $0.0056 |
| 1   | supplier-invite       | without-mcp | no    | no       | 3      | —                 | 0          | 5140   | $0.0025 |
| 1   | supplier-invite       | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 28737  | $0.0054 |
| 1   | supplier-invite       | with-mcp    | yes   | yes      | 0      | yes               | 13         | 53521  | $0.0064 |
| 1   | promotions-list       | without-mcp | no    | no       | 1      | —                 | 0          | 5242   | $0.0025 |
| 1   | promotions-list       | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 23756  | $0.0039 |
| 1   | promotions-list       | with-mcp    | yes   | yes      | 0      | yes               | 10         | 58092  | $0.0061 |
| 1   | refund-success        | without-mcp | no    | no       | 4      | —                 | 0          | 3265   | $0.0015 |
| 1   | refund-success        | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 21960  | $0.0032 |
| 1   | refund-success        | with-mcp    | yes   | yes      | 0      | yes               | 10         | 58377  | $0.0047 |
| 1   | staff-permissions     | without-mcp | yes   | yes      | 0      | —                 | 0          | 4477   | $0.0021 |
| 1   | staff-permissions     | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 27289  | $0.0034 |
| 1   | staff-permissions     | with-mcp    | yes   | yes      | 0      | yes               | 10         | 43403  | $0.0049 |
| 1   | offline-banner        | without-mcp | no    | yes      | 18     | —                 | 0          | 10250  | $0.0050 |
| 1   | offline-banner        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 31623  | $0.0071 |
| 1   | offline-banner        | with-mcp    | yes   | yes      | 0      | yes               | 12         | 91805  | $0.0126 |
| 1   | weekly-report-card    | without-mcp | no    | no       | 1      | —                 | 0          | 4735   | $0.0023 |
| 1   | weekly-report-card    | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 26710  | $0.0051 |
| 1   | weekly-report-card    | with-mcp    | yes   | yes      | 0      | yes               | 9          | 50648  | $0.0074 |
| 2   | orders-table          | without-mcp | yes   | yes      | 0      | —                 | 0          | 3755   | $0.0018 |
| 2   | orders-table          | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 31142  | $0.0040 |
| 2   | orders-table          | with-mcp    | yes   | yes      | 0      | yes               | 8          | 42393  | $0.0050 |
| 2   | product-form          | without-mcp | no    | no       | 2      | —                 | 0          | 4358   | $0.0021 |
| 2   | product-form          | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 32336  | $0.0043 |
| 2   | product-form          | with-mcp    | yes   | yes      | 0      | yes               | 9          | 56395  | $0.0063 |
| 2   | sales-dashboard       | without-mcp | no    | yes      | 4      | —                 | 0          | 5443   | $0.0026 |
| 2   | sales-dashboard       | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 24217  | $0.0043 |
| 2   | sales-dashboard       | with-mcp    | yes   | yes      | 0      | yes               | 8          | 49401  | $0.0073 |
| 2   | empty-orders          | without-mcp | yes   | yes      | 0      | —                 | 0          | 2259   | $0.0010 |
| 2   | empty-orders          | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 22068  | $0.0030 |
| 2   | empty-orders          | with-mcp    | yes   | yes      | 0      | yes               | 9          | 41643  | $0.0037 |
| 2   | checkout-error        | without-mcp | no    | no       | 3      | —                 | 0          | 6773   | $0.0033 |
| 2   | checkout-error        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 28560  | $0.0054 |
| 2   | checkout-error        | with-mcp    | yes   | yes      | 0      | yes               | 8          | 35301  | $0.0048 |
| 2   | delete-product-dialog | without-mcp | no    | no       | 9      | —                 | 0          | 3175   | $0.0015 |
| 2   | delete-product-dialog | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 25056  | $0.0026 |
| 2   | delete-product-dialog | with-mcp    | yes   | yes      | 0      | yes               | 7          | 26954  | $0.0028 |
| 2   | inventory-low-stock   | without-mcp | yes   | yes      | 0      | —                 | 0          | 4230   | $0.0020 |
| 2   | inventory-low-stock   | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 24700  | $0.0041 |
| 2   | inventory-low-stock   | with-mcp    | yes   | yes      | 0      | yes               | 8          | 30511  | $0.0038 |
| 2   | customer-profile      | without-mcp | no    | no       | 4      | —                 | 0          | 5780   | $0.0028 |
| 2   | customer-profile      | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 27932  | $0.0052 |
| 2   | customer-profile      | with-mcp    | yes   | yes      | 0      | yes               | 13         | 92158  | $0.0093 |
| 2   | delivery-slot-picker  | without-mcp | yes   | yes      | 0      | —                 | 0          | 5508   | $0.0026 |
| 2   | delivery-slot-picker  | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 25139  | $0.0045 |
| 2   | delivery-slot-picker  | with-mcp    | yes   | yes      | 0      | yes               | 11         | 64594  | $0.0065 |
| 2   | command-search        | without-mcp | yes   | yes      | 0      | —                 | 0          | 5650   | $0.0027 |
| 2   | command-search        | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 27945  | $0.0035 |
| 2   | command-search        | with-mcp    | yes   | yes      | 0      | no                | 6          | 34777  | $0.0040 |
| 2   | mobile-filters-sheet  | without-mcp | no    | no       | 8      | —                 | 0          | 6673   | $0.0032 |
| 2   | mobile-filters-sheet  | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 38815  | $0.0061 |
| 2   | mobile-filters-sheet  | with-mcp    | yes   | yes      | 0      | yes               | 11         | 69483  | $0.0097 |
| 2   | order-detail          | without-mcp | no    | no       | 11     | —                 | 0          | 5826   | $0.0028 |
| 2   | order-detail          | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 29783  | $0.0052 |
| 2   | order-detail          | with-mcp    | yes   | yes      | 0      | yes               | 13         | 107096 | $0.0087 |
| 2   | settings-store        | without-mcp | no    | no       | 2      | —                 | 0          | 4771   | $0.0023 |
| 2   | settings-store        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 34608  | $0.0043 |
| 2   | settings-store        | with-mcp    | yes   | yes      | 0      | yes               | 11         | 65882  | $0.0070 |
| 2   | loading-orders        | without-mcp | no    | no       | 1      | —                 | 0          | 5374   | $0.0026 |
| 2   | loading-orders        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 32999  | $0.0039 |
| 2   | loading-orders        | with-mcp    | yes   | yes      | 0      | yes               | 7          | 40947  | $0.0048 |
| 2   | supplier-invite       | without-mcp | no    | no       | 4      | —                 | 0          | 4596   | $0.0022 |
| 2   | supplier-invite       | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 37573  | $0.0052 |
| 2   | supplier-invite       | with-mcp    | yes   | yes      | 0      | yes               | 12         | 66387  | $0.0080 |
| 2   | promotions-list       | without-mcp | no    | no       | 1      | —                 | 0          | 6249   | $0.0030 |
| 2   | promotions-list       | docs-mcp    | yes   | yes      | 0      | —                 | 13         | 47757  | $0.0067 |
| 2   | promotions-list       | with-mcp    | yes   | yes      | 0      | yes               | 13         | 78202  | $0.0090 |
| 2   | refund-success        | without-mcp | no    | no       | 2      | —                 | 0          | 3338   | $0.0016 |
| 2   | refund-success        | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 22717  | $0.0030 |
| 2   | refund-success        | with-mcp    | yes   | yes      | 0      | yes               | 7          | 29151  | $0.0038 |
| 2   | staff-permissions     | without-mcp | yes   | yes      | 0      | —                 | 0          | 4112   | $0.0019 |
| 2   | staff-permissions     | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 27304  | $0.0033 |
| 2   | staff-permissions     | with-mcp    | yes   | yes      | 0      | yes               | 9          | 40150  | $0.0041 |
| 2   | offline-banner        | without-mcp | no    | no       | 5      | —                 | 0          | 8849   | $0.0043 |
| 2   | offline-banner        | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 29053  | $0.0059 |
| 2   | offline-banner        | with-mcp    | yes   | yes      | 0      | yes               | 10         | 63679  | $0.0108 |
| 2   | weekly-report-card    | without-mcp | no    | no       | 1      | —                 | 0          | 4193   | $0.0020 |
| 2   | weekly-report-card    | docs-mcp    | yes   | yes      | 0      | —                 | 11         | 44217  | $0.0053 |
| 2   | weekly-report-card    | with-mcp    | yes   | yes      | 0      | yes               | 9          | 49102  | $0.0067 |
| 3   | orders-table          | without-mcp | yes   | yes      | 0      | —                 | 0          | 3059   | $0.0014 |
| 3   | orders-table          | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 24751  | $0.0030 |
| 3   | orders-table          | with-mcp    | yes   | yes      | 0      | yes               | 8          | 42458  | $0.0043 |
| 3   | product-form          | without-mcp | no    | no       | 3      | —                 | 0          | 4331   | $0.0020 |
| 3   | product-form          | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 31901  | $0.0044 |
| 3   | product-form          | with-mcp    | yes   | yes      | 0      | yes               | 8          | 55191  | $0.0065 |
| 3   | sales-dashboard       | without-mcp | no    | yes      | 2      | —                 | 0          | 5663   | $0.0027 |
| 3   | sales-dashboard       | docs-mcp    | yes   | yes      | 0      | —                 | 7          | 26493  | $0.0051 |
| 3   | sales-dashboard       | with-mcp    | yes   | yes      | 0      | yes               | 10         | 86763  | $0.0087 |
| 3   | empty-orders          | without-mcp | yes   | yes      | 0      | —                 | 0          | 3183   | $0.0015 |
| 3   | empty-orders          | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 21250  | $0.0026 |
| 3   | empty-orders          | with-mcp    | yes   | yes      | 0      | yes               | 10         | 67645  | $0.0042 |
| 3   | checkout-error        | without-mcp | no    | no       | 3      | —                 | 0          | 7496   | $0.0036 |
| 3   | checkout-error        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 28030  | $0.0051 |
| 3   | checkout-error        | with-mcp    | yes   | yes      | 0      | yes               | 11         | 82101  | $0.0074 |
| 3   | delete-product-dialog | without-mcp | no    | no       | 9      | —                 | 0          | 3204   | $0.0015 |
| 3   | delete-product-dialog | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 24676  | $0.0025 |
| 3   | delete-product-dialog | with-mcp    | yes   | yes      | 0      | yes               | 9          | 41792  | $0.0045 |
| 3   | inventory-low-stock   | without-mcp | no    | yes      | 8      | —                 | 0          | 3856   | $0.0018 |
| 3   | inventory-low-stock   | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 40604  | $0.0042 |
| 3   | inventory-low-stock   | with-mcp    | yes   | yes      | 0      | yes               | 8          | 31947  | $0.0042 |
| 3   | customer-profile      | without-mcp | no    | no       | 5      | —                 | 0          | 6812   | $0.0033 |
| 3   | customer-profile      | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 27461  | $0.0050 |
| 3   | customer-profile      | with-mcp    | yes   | yes      | 0      | yes               | 14         | 98845  | $0.0107 |
| 3   | delivery-slot-picker  | without-mcp | no    | no       | 1      | —                 | 0          | 5229   | $0.0025 |
| 3   | delivery-slot-picker  | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 42177  | $0.0047 |
| 3   | delivery-slot-picker  | with-mcp    | yes   | yes      | 0      | yes               | 13         | 68710  | $0.0073 |
| 3   | command-search        | without-mcp | yes   | yes      | 0      | —                 | 0          | 4082   | $0.0019 |
| 3   | command-search        | docs-mcp    | yes   | yes      | 0      | —                 | 6          | 41970  | $0.0043 |
| 3   | command-search        | with-mcp    | yes   | yes      | 0      | yes               | 7          | 68903  | $0.0070 |
| 3   | mobile-filters-sheet  | without-mcp | no    | no       | 7      | —                 | 0          | 7008   | $0.0034 |
| 3   | mobile-filters-sheet  | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 35188  | $0.0057 |
| 3   | mobile-filters-sheet  | with-mcp    | yes   | yes      | 0      | no                | 11         | 89789  | $0.0118 |
| 3   | order-detail          | without-mcp | no    | no       | 2      | —                 | 0          | 5245   | $0.0025 |
| 3   | order-detail          | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 25778  | $0.0043 |
| 3   | order-detail          | with-mcp    | yes   | yes      | 0      | yes               | 10         | 61841  | $0.0069 |
| 3   | settings-store        | without-mcp | no    | no       | 2      | —                 | 0          | 5688   | $0.0027 |
| 3   | settings-store        | docs-mcp    | yes   | yes      | 0      | —                 | 9          | 35175  | $0.0046 |
| 3   | settings-store        | with-mcp    | yes   | yes      | 0      | yes               | 11         | 82223  | $0.0080 |
| 3   | loading-orders        | without-mcp | no    | no       | 1      | —                 | 0          | 4969   | $0.0024 |
| 3   | loading-orders        | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 25709  | $0.0029 |
| 3   | loading-orders        | with-mcp    | yes   | yes      | 0      | yes               | 10         | 41540  | $0.0044 |
| 3   | supplier-invite       | without-mcp | no    | no       | 2      | —                 | 0          | 5963   | $0.0029 |
| 3   | supplier-invite       | docs-mcp    | yes   | yes      | 0      | —                 | 11         | 37511  | $0.0048 |
| 3   | supplier-invite       | with-mcp    | yes   | yes      | 0      | yes               | 11         | 65331  | $0.0076 |
| 3   | promotions-list       | without-mcp | yes   | yes      | 0      | —                 | 0          | 5440   | $0.0026 |
| 3   | promotions-list       | docs-mcp    | yes   | yes      | 0      | —                 | 13         | 41720  | $0.0067 |
| 3   | promotions-list       | with-mcp    | yes   | yes      | 0      | yes               | 13         | 81679  | $0.0092 |
| 3   | refund-success        | without-mcp | no    | no       | 3      | —                 | 0          | 4002   | $0.0019 |
| 3   | refund-success        | docs-mcp    | no    | no       | 1      | —                 | 9          | 37844  | $0.0035 |
| 3   | refund-success        | with-mcp    | yes   | yes      | 0      | yes               | 8          | 43094  | $0.0048 |
| 3   | staff-permissions     | without-mcp | yes   | yes      | 0      | —                 | 0          | 4595   | $0.0022 |
| 3   | staff-permissions     | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 33711  | $0.0042 |
| 3   | staff-permissions     | with-mcp    | yes   | yes      | 0      | yes               | 8          | 32118  | $0.0044 |
| 3   | offline-banner        | without-mcp | no    | no       | 9      | —                 | 0          | 11885  | $0.0058 |
| 3   | offline-banner        | docs-mcp    | yes   | yes      | 0      | —                 | 10         | 33831  | $0.0073 |
| 3   | offline-banner        | with-mcp    | yes   | yes      | 0      | yes               | 11         | 63880  | $0.0110 |
| 3   | weekly-report-card    | without-mcp | no    | no       | 2      | —                 | 0          | 5234   | $0.0025 |
| 3   | weekly-report-card    | docs-mcp    | yes   | yes      | 0      | —                 | 8          | 26104  | $0.0049 |
| 3   | weekly-report-card    | with-mcp    | yes   | yes      | 0      | yes               | 9          | 51910  | $0.0074 |

Reproduce: `pnpm eval` (needs `ANTHROPIC_API_KEY`). Source: `evals/results/latest.json`.
