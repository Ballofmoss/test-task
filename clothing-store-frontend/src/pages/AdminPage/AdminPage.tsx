import React, { useState, useEffect } from "react";
import { productsApi } from "../../api/productsApi";
import type { Product } from "../../types";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Stack,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Inventory,
  Add,
  Assessment,
  Replay,
  Search,
  Update,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Форма добавления товара
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    price: "",
    color: "",
    size: "M",
    type: "0",
    quantity: "",
  });

  // Форма пополнения склада
  const [restockForm, setRestockForm] = useState({
    productId: "",
    quantity: "",
    selectedProduct: null as Product | null,
  });

  // Отчет
  const [reportType, setReportType] = useState<string>("");
  const [reportSize, setReportSize] = useState<string>("");
  const [reportData, setReportData] = useState<Product[]>([]);

  // Загружаем список товаров для пополнения
  useEffect(() => {
    if (tabValue === 1) {
      // Вкладка пополнения склада
      loadProducts();
    }
  }, [tabValue]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      showMessage("Ошибка загрузки товаров", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        barcode: newProduct.barcode,
        price: parseFloat(newProduct.price),
        color: newProduct.color,
        size: newProduct.size,
        type: parseInt(newProduct.type),
        quantity: parseInt(newProduct.quantity),
      };

      await productsApi.create(productData);
      showMessage("Товар успешно добавлен!");

      // Сброс формы
      setNewProduct({
        name: "",
        barcode: "",
        price: "",
        color: "",
        size: "M",
        type: "0",
        quantity: "",
      });
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage("Ошибка при добавлении товара", "error");
    }
  };

  const handleRestock = async () => {
    if (!restockForm.productId || !restockForm.quantity) {
      showMessage("Выберите товар и укажите количество", "error");
      return;
    }

    const quantity = parseInt(restockForm.quantity);
    if (quantity <= 0) {
      showMessage("Количество должно быть больше 0", "error");
      return;
    }

    try {
      await productsApi.restockProduct(
        parseInt(restockForm.productId),
        quantity,
      );

      showMessage(`Товар успешно пополнен на ${quantity} шт.`);

      // Обновляем информацию о товаре
      loadProducts();

      // Сброс формы
      setRestockForm({
        productId: "",
        quantity: "",
        selectedProduct: null,
      });
    } catch (error: any) {
      console.error("Ошибка пополнения:", error);
      const errorMsg =
        error.response?.data?.message || "Ошибка при пополнении товара";
      showMessage(errorMsg, "error");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const type = reportType ? parseInt(reportType) : undefined;
      const response = await productsApi.getStockReport(
        type,
        reportSize || undefined,
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage("Ошибка при загрузке отчета", "error");
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    setRestockForm({
      ...restockForm,
      productId,
      selectedProduct: product || null,
    });
  };

  // Фильтрация товаров для поиска
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.color?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTypeLabel = (type: number) => {
    const types = ["Свитер", "Брюки", "Шорты", "Футболка", "Куртка"];
    return types[type] || "Неизвестно";
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { label: "Нет в наличии", color: "error" as const };
    if (quantity < 5) return { label: "Мало", color: "warning" as const };
    return { label: "В наличии", color: "success" as const };
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Inventory sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h4">Панель администратора</Typography>
        </Box>

        {message && (
          <Alert
            severity={message.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab icon={<Add />} label="Добавить товар" />
          <Tab icon={<Replay />} label="Пополнить склад" />
          <Tab icon={<Assessment />} label="Отчет по остаткам" />
        </Tabs>

        {/* Вкладка 1: Добавление товара */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Добавление нового товара
              </Typography>
              <Box component="form" sx={{ maxWidth: 500 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Название"
                    required
                    fullWidth
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                  <TextField
                    label="Штрихкод"
                    fullWidth
                    value={newProduct.barcode}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, barcode: e.target.value })
                    }
                  />
                  <TextField
                    label="Цена"
                    type="number"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">₽</InputAdornment>
                      ),
                    }}
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                  <TextField
                    label="Цвет"
                    fullWidth
                    value={newProduct.color}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, color: e.target.value })
                    }
                  />
                  <Select
                    value={newProduct.size}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, size: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value="XS">XS</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                  </Select>
                  <Select
                    value={newProduct.type}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, type: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value="0">Свитер</MenuItem>
                    <MenuItem value="1">Брюки</MenuItem>
                    <MenuItem value="2">Шорты</MenuItem>
                    <MenuItem value="3">Футболка</MenuItem>
                    <MenuItem value="4">Куртка</MenuItem>
                  </Select>
                  <TextField
                    label="Начальное количество"
                    type="number"
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">шт.</InputAdornment>
                      ),
                    }}
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity: e.target.value })
                    }
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduct}
                    size="large"
                    startIcon={<Add />}
                    disabled={
                      !newProduct.name ||
                      !newProduct.price ||
                      !newProduct.quantity
                    }
                  >
                    Добавить товар
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Вкладка 2: Пополнение склада */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Пополнение склада
              </Typography>

              <Stack spacing={3}>
                {/* Форма выбора товара */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Выберите товар для пополнения
                  </Typography>

                  <TextField
                    label="Поиск товара"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer sx={{ maxHeight: 300, mb: 3 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Товар</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Размер</TableCell>
                            <TableCell>Цвет</TableCell>
                            <TableCell align="right">Остаток</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Выбрать</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredProducts.map((product) => {
                            const status = getStockStatus(product.quantity);
                            return (
                              <TableRow
                                key={product.id}
                                hover
                                selected={
                                  restockForm.productId ===
                                  product.id.toString()
                                }
                              >
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                  {getTypeLabel(product.type)}
                                </TableCell>
                                <TableCell>{product.size}</TableCell>
                                <TableCell>{product.color}</TableCell>
                                <TableCell align="right">
                                  {product.quantity} шт.
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={status.label}
                                    color={status.color}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant={
                                      restockForm.productId ===
                                      product.id.toString()
                                        ? "contained"
                                        : "outlined"
                                    }
                                    onClick={() =>
                                      handleProductSelect(product.id.toString())
                                    }
                                  >
                                    Выбрать
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Информация о выбранном товаре */}
                  {restockForm.selectedProduct && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Выбранный товар:
                      </Typography>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {restockForm.selectedProduct.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getTypeLabel(restockForm.selectedProduct.type)} •
                            Размер: {restockForm.selectedProduct.size} • Цвет:{" "}
                            {restockForm.selectedProduct.color}
                          </Typography>
                        </Box>
                        <Chip
                          label={`Текущий остаток: ${restockForm.selectedProduct.quantity} шт.`}
                          color="info"
                          variant="outlined"
                        />
                      </Stack>
                    </Paper>
                  )}
                </Box>

                {/* Форма пополнения */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Количество для пополнения
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Количество"
                      type="number"
                      required
                      value={restockForm.quantity}
                      onChange={(e) =>
                        setRestockForm({
                          ...restockForm,
                          quantity: e.target.value,
                        })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">шт.</InputAdornment>
                        ),
                      }}
                      sx={{ width: 200 }}
                      disabled={!restockForm.selectedProduct}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRestock}
                      startIcon={<Update />}
                      disabled={
                        !restockForm.selectedProduct || !restockForm.quantity
                      }
                      size="large"
                    >
                      Пополнить склад
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={loadProducts}
                      startIcon={<Replay />}
                    >
                      Обновить список
                    </Button>
                  </Stack>

                  {restockForm.selectedProduct && restockForm.quantity && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      После пополнения остаток составит:{" "}
                      <strong>
                        {restockForm.selectedProduct.quantity +
                          parseInt(restockForm.quantity)}{" "}
                        шт.
                      </strong>
                    </Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Вкладка 3: Отчет по остаткам */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Отчет по остаткам на складе
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  displayEmpty
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">Все типы</MenuItem>
                  <MenuItem value="0">Свитеры</MenuItem>
                  <MenuItem value="1">Брюки</MenuItem>
                  <MenuItem value="2">Шорты</MenuItem>
                  <MenuItem value="3">Футболки</MenuItem>
                  <MenuItem value="4">Куртки</MenuItem>
                </Select>

                <Select
                  value={reportSize}
                  onChange={(e) => setReportSize(e.target.value)}
                  displayEmpty
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">Все размеры</MenuItem>
                  <MenuItem value="XS">XS</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                </Select>

                <Button
                  variant="contained"
                  onClick={handleGenerateReport}
                  startIcon={<Assessment />}
                >
                  Сформировать отчет
                </Button>
              </Stack>

              {reportData.length > 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Товар</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Размер</TableCell>
                        <TableCell>Цвет</TableCell>
                        <TableCell align="right">Цена</TableCell>
                        <TableCell align="right">Остаток</TableCell>
                        <TableCell>Статус</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((product) => {
                        const status = getStockStatus(product.quantity);
                        return (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{getTypeLabel(product.type)}</TableCell>
                            <TableCell>{product.size}</TableCell>
                            <TableCell>{product.color}</TableCell>
                            <TableCell align="right">
                              {product.price} ₽
                            </TableCell>
                            <TableCell align="right">
                              {product.quantity} шт.
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={status.label}
                                color={status.color}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {reportData.length === 0 && tabValue === 2 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  py={5}
                >
                  Выберите параметры и нажмите "Сформировать отчет"
                </Typography>
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminPanel;
