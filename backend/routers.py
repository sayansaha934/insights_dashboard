from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from services import CustomerService,ProductService, OverViewService,InsightService
insights_router = APIRouter()


@insights_router.get("/customers")
def get_customers(
    search: str = Query(None, description="Search by name or region"),
):
    return CustomerService().get_customers(search)


@insights_router.get("/customers/{customer_id}")
def get_customer_profile(customer_id: str):
    return CustomerService().get_customer_profile(customer_id)


@insights_router.get("/products")
def get_products(
    search: str = Query(None, description="Search by name or category"),
):
    return ProductService().get_products(search)


@insights_router.get("/products/{product_id}")
def get_product_profile(product_id: str):
    return ProductService().get_product_profile(product_id)


@insights_router.get("/overview")
def get_overview():
    return OverViewService().get_overview()


@insights_router.get("/insights/anomalies")
def get_anomalous_customers():
    return InsightService().detect_anomalous_customers()


@insights_router.get("/insights/trends")
def get_trending_products():
    return InsightService().highlight_trending_products()
